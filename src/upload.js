// @ts-nocheck

import upload from "./helpers.js";

const domParser = new DOMParser();

// Don't include already hosted assets
const pattern = /^https?:\/\/$/i;

/**
 * Find and upload images to Imgur
 * @param {boolean} [parseHTML=true] Whether to parse HTML fields
 * @param {boolean} [dryRun=true] Whether to save changes
 */
export default async function uploadImages(parseHTML = true, dryRun = true) {

	console.log(`Imgur Upload has begun...\n\nParse HTML: ${parseHTML}\nDry Run: ${dryRun}`);

	console.groupCollapsed("Uploading scenes to Imgur...");
	for (const scene of game.scenes) {
		await simple(scene);
		await simple(scene, "foreground");
		embedded(scene, "tokens", "img", "TokenDocument");
		embedded(scene, "tiles", "img", "Tile");
	}
	console.groupEnd();

	console.groupCollapsed("Uploading actors to Imgur...");
	for (const actor of game.actors) {
		await simple(actor);
		if (actor.data.token.img?.match(pattern)) {
			const uploaded = await upload(actor.data.token.img);
			if (uploaded) {
				console.log(`${actor.data.token.name}.token.img: ${actor.data.token.img} => ${uploaded}`);
				if (!dryRun) {
					await actor.update({
						token: { img: uploaded },
					});
				}
			}
		}
		if (parseHTML) await htmlFields(actor);
		await embedded(actor, "data.items", "img", "Item");
		await embedded(actor, "data.effects", "icon", "ActiveEffect");
	}
	console.groupEnd();

	console.groupCollapsed("Uploading items to Imgur...");
	for (const item of game.items) {
		await simple(item);
		if (parseHTML) await htmlFields(item);
		await embedded(item, "data.effects", "icon", "ActiveEffect");
	}
	console.groupEnd();

	console.groupCollapsed("Uploading journals to Imgur...");
	for (const journal of game.journal) {
		await simple(journal);
		if (journal.data.content) {
			let hasContentUpdate = false;
			const doc = domParser.parseFromString(journal.data.content, "text/html");
			for (const link of doc.getElementsByTagName("img")) {
				if (link.src?.match(pattern)) {
					const uploaded = await upload(link.src);
					if (uploaded) {
						console.log(
							`${journal.name}.img: ${link.src} => ${uploaded}`
						);
						link.src = uploaded;
						hasContentUpdate = true;
					}
				}
			}

			if (hasContentUpdate && !dryRun) {
				await journal.update({
					content: doc.body.innerHTML,
				});
			}
		}
	}
	console.groupEnd();

	// TODO v2 - Style sheets (should be used for updating those linked in the world's manifest)
	// [...document.styleSheets].map(sheet => [...sheet.cssRules]).flat()
	// TODO v2 - remove some duplicate code above
}

/**
 * Uploads the images in the HTML fields of a given document
 * @param {Actor | Item} doc The document to update
 */
async function htmlFields(doc) {
	const fields = game.system.template[doc.documentName]?.htmlFields;

	if (fields && fields.length !== 0) {
		for (const field of fields) {
			const content = getProperty(doc.data.data, field);
			if (content) {
				let hasContentUpdate = false;
				const html = domParser.parseFromString(content, "text/html");
				for (const link of html.getElementsByTagName("img")) {
					if (link.src?.match(pattern)) {
						const uploaded = await upload(link.src);
						if (uploaded) {
							console.log(
								`${doc.name}.${field}.img: ${link.src} => ${uploaded}`
							);
							link.src = uploaded;
							hasContentUpdate = true;
						}
					}
				}

				for (const hasStyle of [
					...[...html.styleSheets].map(sheet => [...sheet.cssRules]).flat(),
					...html.getElementsByTagName("*"),
				]) {
					if (hasStyle instanceof CSSStyleRule || hasStyle instanceof HTMLElement) {
						for (const property of ["backgroundImage", "listStyleImage", "borderImageSource"]) {
							const url = hasStyle.style?.[property]?.match(/url\(["']?([^"']*)["']?\)/i)?.[1];
							if (url?.match(pattern)) {
								const uploaded = await upload(url);
								if (uploaded) {
									console.log(
										`${hasStyle.selectorText ?? hasStyle.tagName}.style: ${
											hasStyle.style?.[property]
										} => ${uploaded}`
									);
									hasStyle.style[property] = uploaded;
									hasContentUpdate = true;
								}
							}
						}
					}
				}

				if (hasContentUpdate && !dryRun) {
					await doc.update({
						[`data.${field}`]: html.body.innerHTML,
					});
				}
			}
		}
	}
}

/**
 * Upload the image for the given document
 * @param {Scene | Actor | Item | Journal} doc The document to work with
 * @param {string} [path="img"] The path to the image property
 */
async function simple(doc, path = "img") {
	const value = doc.data[path];
	if (value?.match(pattern)) {
		const uploaded = await upload(value);
		if (uploaded) {
			console.log(`${doc.name}.${path}: ${value} => ${uploaded}`);
			if (!dryRun) {
				await doc.update({ [path]: uploaded });
			}
		}
	}
}

/**
 * Upload embedded
 * @param {Actor | Item} doc The document to work with
 * @param {string} collectionPath The path of the embedded documents collection
 */
async function embedded(doc, collectionPath, assetPath, documentType) {
	const updates = [];
	let shownGroup = false;
	for (const eDoc of getProperty(doc, collectionPath)) {
		if (eDoc.data[assetPath]?.match(pattern)) {
			const uploaded = upload(eDoc.data[assetPath]);
			if (uploaded) {
				if (!shownGroup) {
					console.groupCollapsed(`${doc.name} ${collectionPath}`);
					shownGroup = true;
				}
				console.log(`${doc.name} ${eDoc.name} ${collectionPath}: ${eDoc.data[assetPath]} => ${uploaded}`);
				updates.push({
					_id: eDoc.id,
					img: uploaded,
				});
			}
		}
		if (parseHTML) await htmlFields(eDoc);
	}
	if (shownGroup) console.groupEnd();
	if (updates.length && !dryRun) {
		await doc.updateEmbeddedDocuments(documentType, updates);
	}
}
