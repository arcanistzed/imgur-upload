async function upload(file) {
    const clientID = "c8f504ae93f9a0d";

    const headers = new Headers();
    headers.append("Authorization", `Client-ID ${clientID}`);

    const formData = new FormData();
    formData.append("image", file);

    const options = {
        method: "POST",
        headers: headers,
        body: formData,
        redirect: "follow",
    };

    const response = await fetch("https://api.imgur.com/3/image", options);
    const rateLimit = Object.fromEntries([...response.headers.entries()].filter(h => h[0].startsWith("x-ratelimit")));

    const json = await response.json();
    const url = json.success ? json.data.link : null;

    return {response, rateLimit, json, url};
}
