/**
 * Upload the image at a given path to Imgur and return the new URL
 * @param {string} path - The current path to the image
 * @return {Promise<string | null>} - The new path to the uploaded image, or null if the image was not successfully uploaded
 */
export default async function upload(path: string): Promise<string | null> {
	const clientID = "c8f504ae93f9a0d";

	const blob = await (await fetch(path)).blob();

	const formData = new FormData();
	formData.append("image", blob);

	const headers = new Headers();
	headers.append("Authorization", `Client-ID ${clientID}`);

	const options = {
		method: "POST",
		headers: headers,
		body: formData,
		redirect: "follow" as const,
	};

	let response;
	try {
		response = await fetch("https://api.imgur.com/3/image", options);
	} catch {
		console.log("Failed to fetch", options);
		return null;
	}

	const rateLimit = Object.fromEntries(
		[...response.headers.entries()].filter(h =>
			h[0].startsWith("x-ratelimit")
		)
	);

	const json = await response.json();
	const url = json.success ? json.data.link : null;

	if (url) {
		console.log(
			`%cUploaded file at "${path}" to "${url}"`,
			"background-color: lightgreen; padding: 0.25rem",
			{
				response,
				rateLimit,
				json,
				url,
			}
		);
		return url;
	} else {
		console.log(
			`%cError uploading file at "${path}": ${json.data.error}`,
			"background-color: lightcoral; font-weight: bold; padding: 0.25rem",
			{
				response,
				rateLimit,
				json,
				url,
			}
		);
		return null;
	}
}
