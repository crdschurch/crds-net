exports.handler = async function (event) {
  const { id, space_id, environment = "master" } = event.queryStringParameters || {};

  if (!id || !space_id) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing preview parameters" }) };
  }

  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN;

  const response = await fetch(
    `https://preview.contentful.com/spaces/${space_id}/environments/${environment}/entries/${id}?access_token=${accessToken}`
  );

  if (!response.ok) {
    return { statusCode: response.status, body: JSON.stringify({ error: "inside preview-entry Unable to fetch preview entry" }) };
  }

  const data = await response.json();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, previewAccessToken: accessToken }),
  };
};