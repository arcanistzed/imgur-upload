/* eslint-disable curly */
/* eslint-disable jsdoc/newline-after-description */
/* eslint-disable jsdoc/tag-lines */

import upload from "./helpers.js";

const domParser = new DOMParser();

/**
 * Find and upload images to Imgur
 * @param {boolean} [parseHTML=true] Whether to parse HTML fields
 * @param {boolean} [dryRun=true] Whether to save changes
 */
export default async function uploadImages(parseHTML = true, dryRun = true) {
	const search = `worlds/${game.world.id}`;
	if (game.scenes && game.actors && game.items && game.journal) {
		console.groupCollapsed("Uploading scenes to Imgur...");
		for (const scene of game.scenes) {
			await simple(scene, search, dryRun);
			await simple(scene, search, dryRun, "foreground");
			const tokenUpdates = [];
			let shownGroup = false;
			for (const token of scene.tokens) {
				if (token.data.img?.startsWith(search)) {
					const uploaded = await upload(token.data.img);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${scene.name} tokens`);
							shownGroup = true;
						}
						console.log(
							`${token.name}.img: ${token.data.img} => ${token.data.img.replace(search, uploaded)}`
						);
						tokenUpdates.push({
							_id: token.id,
							img: uploaded,
						});
					}
				}

				// Update prototype token images of unlinked tokens
				if (token.actor?.isToken) {
					// runAsActor();
				}
			}
			if (shownGroup) console.groupEnd();
			if (tokenUpdates.length && !dryRun) {
				await scene.updateEmbeddedDocuments("Token", tokenUpdates);
			}
			const tileUpdates = [];
			shownGroup = false;
			for (const tile of scene.tiles) {
				if (tile.data.img?.startsWith(search)) {
					const uploaded = await upload(tile.data.img);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${scene.name} tiles`);
							shownGroup = true;
						}
						console.log(`tile.img: ${tile.data.img} => ${tile.data.img.replace(search, uploaded)}`);
						tileUpdates.push({
							_id: tile.id,
							img: uploaded,
						});
					}
				}
			}
			if (shownGroup) console.groupEnd();
			if (tileUpdates.length && !dryRun) {
				await scene.updateEmbeddedDocuments("Tile", tileUpdates);
			}
		}
		console.groupEnd();

		console.groupCollapsed("Uploading actors to Imgur...");
		for (const actor of game.actors) {
			await simple(actor, search, dryRun);
			if (actor.data.token.img?.startsWith(search)) {
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
			if (parseHTML) await htmlFields(actor, search, dryRun);
			const itemUpdates = [];
			let shownGroup = false;
			for (const item of actor.data.items) {
				if (item.data.img?.startsWith(search)) {
					const uploaded = await upload(item.data.img);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${actor.name} tokens`);
							shownGroup = true;
						}
						console.log(`${actor.name} ${item.name} item.img: ${item.data.img} => ${uploaded}`);
						itemUpdates.push({
							_id: item.id,
							img: uploaded,
						});
					}
				}
				if (parseHTML) await htmlFields(item, search, dryRun);
			}
			if (shownGroup) console.groupEnd();
			if (itemUpdates.length && !dryRun) {
				await actor.updateEmbeddedDocuments("Item", itemUpdates);
			}
			await effects(actor, search, dryRun);
		}
		console.groupEnd();

		console.groupCollapsed("Uploading items to Imgur...");
		for (const item of game.items) {
			await simple(item, search, dryRun);
			if (parseHTML) await htmlFields(item, search, dryRun);
			await effects(item, search, dryRun);
		}
		console.groupEnd();

		console.groupCollapsed("Uploading journals to Imgur...");
		for (const journal of game.journal) {
			await simple(journal, search, dryRun);
			if (journal.data.content) {
				let hasContentUpdate = false;
				const doc = domParser.parseFromString(journal.data.content, "text/html");
				for (const link of doc.getElementsByTagName("img")) {
					if (link.src?.includes(search)) {
						const uploaded = await upload(link.src);
						if (uploaded) {
							console.log(
								`${journal.name}.img: ${link.src} => ${link.src.replace(search, uploaded)}` // TODO: Don't use replace, override
							);
							link.src = link.src.replace(search, uploaded);
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
}

/**
 * Uploads the images in the HTML fields of a given document
 * @param {Actor | Item} doc The document to search
 * @param {string} search The string to search for
 * @param {boolean} dryRun Whether to save changes
 */
async function htmlFields(doc, search, dryRun) {
	const fields = game.system.template[doc.documentName]?.htmlFields;

	if (fields && fields.length !== 0) {
		for (const field of fields) {
			const content = getProperty(doc.data.data, field);
			if (content) {
				let hasContentUpdate = false;
				const html = domParser.parseFromString(content, "text/html");
				for (const link of html.getElementsByTagName("img")) {
					if (link.src?.includes(search)) {
						const uploaded = await upload(link.src);
						if (uploaded) {
							console.log(
								`${doc.name}.${field}.img: ${link.src} => ${link.src.replace(search, uploaded)}`
							);
							link.src = link.src.replace(search, uploaded);
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
							if (url?.startsWith(search)) {
								const uploaded = await upload(url);
								if (uploaded) {
									console.log(
										`${hasStyle.selectorText ?? hasStyle.tagName}.style: ${
											hasStyle.style?.[property]
										} => ${hasStyle.style?.[property].replace(search, uploaded)}`
									);
									hasStyle.style[property] = hasStyle.style?.[property].replace(search, uploaded);
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
 * @param {string} search The string to search for
 * @param {*} dryRun Whether to save changes
 * @param {string} [path="img"] The path to the image property
 */
async function simple(doc, search, dryRun, path = "img") {
	const value = doc.data[path];
	if (value?.startsWith(search)) {
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
 * Upload effects
 * @param {Actor | Item} doc The document to work with
 * @param {string} search The string to search for
 * @param {*} dryRun Whether to save changes
 * TODO: is it possible to also use this as one generic function for embedded tiles, tokens, items?
 */
async function effects(doc, search, dryRun) {
	const effectUpdates = [];
	let shownGroup = false;
	for (const effect of doc.data.effects) {
		if (effect.data.icon?.startsWith(search)) {
			const uploaded = upload(effect.data.icon);
			if (uploaded) {
				if (!shownGroup) {
					console.groupCollapsed(`${doc.name} effects`);
					shownGroup = true;
				}
				console.log(`${doc.name} ${effect.name} effect.img: ${effect.data.icon} => ${uploaded}`);
				effectUpdates.push({
					_id: effect.id,
					img: uploaded,
				});
			}
		}
	}
	if (shownGroup) console.groupEnd();
	if (effectUpdates.length && !dryRun) {
		await doc.updateEmbeddedDocuments("ActiveEffect", effectUpdates);
	}
}
