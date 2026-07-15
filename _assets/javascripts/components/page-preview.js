// -------------------------
// DOM Elements
// -------------------------

const title = document.querySelector("[data-title]");
const permalink = document.querySelector("[data-permalink]");
const body = document.querySelector("[data-body]");
const preloader = document.querySelector("[data-preview-preloader]");

// -------------------------
// Helpers
// -------------------------

function hidePreloader() {
  if (!preloader) return;

  preloader.style.opacity = "0";
  preloader.style.pointerEvents = "none";

  setTimeout(() => {
    preloader.style.display = "none";
  }, 300);
}

function getUrlParameter(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function makeRequest(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Preview request failed (${response.status})`);
  }

  return response.json();
}

async function getEntry(id = getUrlParameter("id")) {
  const accessToken = getUrlParameter("access_token");
  const spaceId = getUrlParameter("space_id");

  if (!id || !spaceId || !accessToken) {
    throw new Error(
      "Missing one or more required URL parameters: id, space_id, access_token."
    );
  }

  const url =
    `https://preview.contentful.com/spaces/${spaceId}` +
    `/entries/${id}?access_token=${accessToken}`;

  return makeRequest(url);
}

function parseBodyMarkdown(markdown) {
  if (!markdown || !body) return;

  marked.setOptions({
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  body.innerHTML = marked.parse(markdown);
}

// -------------------------
// Render
// -------------------------

function renderPage(fields) {
  title.textContent = fields.title || "Untitled Page";

  permalink.textContent = fields.permalink || "";

  parseBodyMarkdown(fields.body || "");

  console.log("Preview fields:", fields);

  hidePreloader();
}

// -------------------------
// Init
// -------------------------

async function init() {
  try {
    const entry = await getEntry();

    console.log("Loaded preview entry:", entry);

    renderPage(entry.fields);
  } catch (err) {
    console.error(err);

    if (body) {
      body.innerHTML = `
        <h2>Unable to load preview</h2>
        <p>${err.message}</p>
      `;
    }

    hidePreloader();
  }
}

init();