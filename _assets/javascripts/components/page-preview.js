async function getPreviewEntry() {
    const url = new URL(window.location.href);

    const id = url.searchParams.get("id");
    const spaceId = url.searchParams.get("space_id");
    const accessToken = url.searchParams.get("access_token");

    if (!id || !spaceId || !accessToken) {
        throw new Error("Missing preview parameters");
    }

    const response = await fetch(
        `https://preview.contentful.com/spaces/${spaceId}/entries/${id}?access_token=${accessToken}`
    );

    if (!response.ok) {
        throw new Error("Unable to fetch preview entry");
    }

    return response.json();
}


async function renderPreview() {
    try {
        const entry = await getPreviewEntry();

        const fields = entry.fields;

        document.querySelector("#title").innerText =
            fields.title || "";

        document.querySelector("#permalink").innerText =
            fields.permalink || "";

        document.querySelector("#body").innerHTML =
            marked.parse(fields.body || "");

        document.querySelector("#loading").style.display = "none";

    } catch(error) {
        console.error(error);

        document.querySelector("#loading").innerText =
            error.message;
    }
}


renderPreview();