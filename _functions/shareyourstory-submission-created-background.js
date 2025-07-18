'use strict';

const axios = require('axios');
const FormData = require('form-data');
const mime = require('mime-types');

let tokenCache = { token: null, fetched: 0, ttl: 0 };

async function getBloomfireToken() {
  const now = Date.now();
  if (!tokenCache.token || now - tokenCache.fetched > (tokenCache.ttl - 60) * 1000) {
    const { data } = await axios.post('https://assets.crossroads.net/api/v2/login', {
      email: process.env.BLOOMFIRE_EMAIL_ADDRESS,
      api_key: process.env.BLOOMFIRE_API_KEY,
    });
    tokenCache = {
      token: data.session_token,
      fetched: now,
      ttl: data.async_api_token.expire_in,
    };
  }
  return tokenCache.token;
}

exports.handler = async (event, _context, callback) => {
  try {
    const { payload } = JSON.parse(event.body);
    const fields = payload.data;
    const file = fields['file-upload'];

    const token = await getBloomfireToken();

    /* ---------- handle optional file upload ---------- */
    const contents = [];
    if (file && file.url) {
      // 1 Reserve an S3 slot
      const { data: slot } = await axios.post(
        'https://assets.crossroads.net/api/v2/s3/tempfile',
        null,
        {
          params: { filename: file.filename },
          headers: { Authorization: `Bloomfire-Session-Token ${token}` },
        }
      );

      // 2 Re‑upload Netlify’s file to Bloomfire S3
      const stream = await axios.get(file.url, { responseType: 'stream' });
      const fd = new FormData();
      Object.entries(slot.form_data).forEach(([k, v]) => fd.append(k, v));
      fd.append('file', stream.data, {
        filename: file.filename,
        contentType: mime.lookup(file.filename) || 'application/octet-stream',
      });
      await axios.post(slot.url, fd, {
        headers: fd.getHeaders(),
        maxBodyLength: Infinity,
      });

      contents.push({
        file: { ...slot.form_data, bucket: slot.bucket, key: slot.key },
      });
    }

    /* ---------- create the post ---------- */
    const { data: post } = await axios.post(
      'https://assets.crossroads.net/api/v2/posts',
      {
        title: `${fields.fullName} Story`,
        post_body: (fields.yourStory || '').trim(),
        description: [
          `Site: ${fields.yourSite}`,
          `Email: ${fields.email}`,
          `Phone: ${fields.phone}`,
        ]
          .filter(Boolean)
          .join(' · '),
        category_ids: [process.env.BLOOMFIRE_CATEGORY_ID],
        contents,
      },
      { headers: { Authorization: `Bloomfire-Session-Token ${token}` } }
    );

    /* ---------- respond ---------- */
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ ok: true, id: post.id }),
    });
  } catch (err) {
    console.error('Share your story background function error', err);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    });
  }
};
