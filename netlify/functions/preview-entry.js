exports.handler = async (event) => {
  const { id, space_id, environment } = event.queryStringParameters || {};

  if (!id || !space_id || !environment) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required parameters: id, space_id, environment" }),
    };
  }

  const accessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server misconfiguration: missing preview access token" }),
    };
  }

  try {
    const response = await fetch(
      `https://preview.contentful.com/spaces/${space_id}/environments/${environment}/entries/${id}?access_token=${accessToken}`
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Unable to fetch preview entry" }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected error fetching preview entry" }),
    };
  }
};