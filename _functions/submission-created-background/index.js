import axios from "axios";
import FormData from "form-data";
import mime from "mime-types";

let tokenCache = { token: null, fetched: 0, ttl: 0 };

async function getBloomfireToken() {
  const now = Date.now();

  const isExpired = !tokenCache.token || now - tokenCache.fetched > (tokenCache.ttl - 60) * 1000;

  if (isExpired) {
    const { data } = await axios.post("https://assets.crossroads.net/api/v2/login", {
      email: process.env.BLOOMFIRE_EMAIL_ADDRESS,
      api_key: process.env.BLOOMFIRE_API_KEY,
    });

    tokenCache = {
      token: data.session_token,
      fetched: now,
      ttl: data.async_api_token.expire_in,
    };

    console.log("✅ Bloomfire token refreshed.");
  }

  return tokenCache.token;
}

async function uploadFileToBloomfire(file, token) {
  if (!file?.url) return null;

  console.log(`📤 Uploading file: ${file.filename}`);

  const { data: slot } = await axios.post("https://assets.crossroads.net/api/v2/s3/tempfile", null, {
    params: { filename: file.filename },
    headers: { Authorization: `Bloomfire-Session-Token ${token}` },
  });

  const fileStream = await axios.get(file.url, { responseType: "stream" });

  // Build FormData for upload
  const form = new FormData();
  Object.entries(slot.form_data).forEach(([key, value]) => form.append(key, value));
  form.append("file", fileStream.data, {
    filename: file.filename,
    contentType: mime.lookup(file.filename) || "application/octet-stream",
  });

  const contentLength = await new Promise((resolve, reject) => form.getLength((err, len) => (err ? reject(err) : resolve(len))));

  try {
    await axios.post(slot.url, form, {
      headers: { ...form.getHeaders({ "Content-Length": contentLength }) },
      maxBodyLength: Infinity,
    });

    console.log(`✅ Uploaded: ${file.filename} → ${slot.key}`);
    return {
      file: { ...slot.form_data, bucket: slot.bucket, key: slot.key },
    };
  } catch (error) {
    console.error(`❌ Failed to upload ${file.filename}:`, error.response?.data || error.message);
    throw error;
  }
}

async function createBloomfirePost(fields, contents, token) {
  const payload = {
    title: `${fields.name} Story`,
    post_body: (fields.message || "").trim(),
    description: [`Site: ${fields.site}`, `Email: ${fields.email}`, `Phone: ${fields.phone}`].filter(Boolean).join(" · "),
    category_ids: [process.env.BLOOMFIRE_CATEGORY_ID],
    contents,
  };

  const { data } = await axios.post("https://assets.crossroads.net/api/v2/posts", payload, {
    headers: { Authorization: `Bloomfire-Session-Token ${token}` },
  });

  console.log("🎉 Bloomfire post created:", data.id);
  return data;
}

export const handler = async (event, _ctx, cb) => {
  try {
    const { payload } = JSON.parse(event.body);
    const { form_name, data: fields } = payload;

    // Only process the correct form
    if (form_name !== "shareyourstory") {
      console.log(`ℹ️ Ignoring unrelated form: "${form_name}"`);
      return cb(null, { statusCode: 200, body: "ignored" });
    }

    console.log(`📬 Received Share Your Story submission from: ${fields.name}`);

    const token = await getBloomfireToken();
    const contents = [];

    // Sequentially upload supported files
    for (const fieldName of ["picture", "video"]) {
      const file = fields[fieldName];
      if (!file) continue;
      const uploaded = await uploadFileToBloomfire(file, token);
      if (uploaded) contents.push(uploaded);
    }

    const post = await createBloomfirePost(fields, contents, token);

    return cb(null, {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: post.id }),
    });
  } catch (error) {
    console.error("❌ Share Your Story → Bloomfire error:", error);
    return cb(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  }
};
