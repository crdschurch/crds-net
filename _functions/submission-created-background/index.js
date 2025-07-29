import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime-types';

// In-memory token cache
let tokenCache = { token: null, fetched: 0, ttl: 0 };
async function getBloomfireToken() {
  const now = Date.now();
  if (!tokenCache.token || now - tokenCache.fetched > (tokenCache.ttl - 60) * 1000) {
    const { data } = await axios.post('https://assets.crossroads.net/api/v2/login', {
      email: process.env.BLOOMFIRE_EMAIL_ADDRESS,
      api_key: process.env.BLOOMFIRE_API_KEY,
    });
    tokenCache = { token: data.session_token, fetched: now, ttl: data.async_api_token.expire_in };
    console.log('Bloomfire token refreshed');
  }
  return tokenCache.token;
}

export const handler = async (event, _ctx, cb) => {
  try {
    const { payload } = JSON.parse(event.body);

    // Scope to the Share Your Story form only
    if (payload.form_name !== 'shareyourstory') {
      console.log(`Ignoring form "${payload.form_name}"`);
      return cb(null, { statusCode: 200, body: 'ignored' });
    }

    const fields = payload.data;
    console.log('Processing Share Your Story submission:', fields);

    const token = await getBloomfireToken();

    const contents = [];
    const file = fields.picture;
    if (file && file.url) {
      const { data: slot } = await axios.post(
        'https://assets.crossroads.net/api/v2/s3/tempfile',
        null,
        {
          params: { filename: file.filename },
          headers: { Authorization: `Bloomfire-Session-Token ${token}` },
        }
      );

      const stream = await axios.get(file.url, { responseType: 'stream' });
      const fd = new FormData();

      Object.entries(slot.form_data).forEach(([k, v]) => fd.append(k, v));
      fd.append('file', stream.data, {
        filename: file.filename,
        contentType: mime.lookup(file.filename) || 'application/octet-stream',
      });

      const contentLength = await new Promise((res, rej) =>
        fd.getLength((err, len) => (err ? rej(err) : res(len)))
      );

      await axios.post(slot.url, fd, {
        headers: { ...fd.getHeaders({ 'Content-Length': contentLength }) },
        maxBodyLength: Infinity,
      });

      contents.push({ file: { ...slot.form_data, bucket: slot.bucket, key: slot.key } });
      console.log('File uploaded, key', slot.key);
    }

    const { data: post } = await axios.post(
      'https://assets.crossroads.net/api/v2/posts',
      {
        title: `${fields.name} Story`,
        post_body: (fields.message || '').trim(),
        description: [`Site: ${fields.site}`, `Email: ${fields.email}`, `Phone: ${fields.phone}`]
          .filter(Boolean)
          .join(' · '),
        category_ids: [process.env.BLOOMFIRE_CATEGORY_ID],
        contents,
      },
      { headers: { Authorization: `Bloomfire-Session-Token ${token}` } }
    );

    console.log('✅ Bloomfire post created, id:', post.id);
    return cb(null, { statusCode: 200, body: JSON.stringify({ ok: true, id: post.id }) });
  } catch (err) {
    console.error('❌ Share Your Story -> Bloomfire background function error:', err);
    return cb(null, { statusCode: 500, body: err.message });
  }
};
