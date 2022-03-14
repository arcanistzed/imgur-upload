import upload from "./helpers.js";

/**
 * Find and upload images to Imgur
 * @param {boolean} [dryRun=true]
 */
export default async function uploadImages(dryRun: boolean = true) {
	if (game instanceof Game && game.scenes && game.actors && game.items && game.journal) {
		const find = `worlds/${game.world.id}`;
		const domParser = new DOMParser();

		console.groupCollapsed("Uploading scenes to Imgur...");
		for (const scene of game.scenes) {
			if (scene.data.img?.startsWith(find)) {
				const uploaded = await upload(scene.data.img);
				if (uploaded) {
					console.log(`${scene.name}.img: ${scene.data.img} => ${scene.data.img.replace(find, uploaded)}`);
					if (!dryRun) {
						await scene.update({ img: uploaded });
					}
				}
			}
			if (scene.data.foreground?.startsWith(find)) {
				const uploaded = await upload(scene.data.foreground);
				if (uploaded) {
					console.log(
						`${scene.name}.foreground: ${scene.data.foreground} => ${scene.data.foreground.replace(
							find,
							uploaded
						)}`
					);
					if (!dryRun) {
						await scene.update({
							img: scene.data.foreground.replace(find, uploaded),
						});
					}
				}
			}
			const tokenUpdates = [];
			let shownGroup = false;
			for (const token of scene.tokens) {
				if (token.data.img?.startsWith(find)) {
					const uploaded = await upload(token.data.img);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${scene.name} tokens`);
							shownGroup = true;
						}
						console.log(
							`${token.name}.img: ${token.data.img} => ${token.data.img.replace(find, uploaded)}`
						);
						tokenUpdates.push({
							_id: token.id,
							img: uploaded,
						});
					}
				}
			}
			if (shownGroup) {
				console.groupEnd();
			}
			if (tokenUpdates.length && !dryRun) {
				await scene.updateEmbeddedDocuments("Token", tokenUpdates);
			}
			const tileUpdates = [];
			shownGroup = false;
			for (const tile of scene.tiles) {
				if (tile.data.img?.startsWith(find)) {
					const uploaded = await upload(tile.data.img);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${scene.name} tiles`);
							shownGroup = true;
						}
						console.log(`tile.img: ${tile.data.img} => ${tile.data.img.replace(find, uploaded)}`);
						tileUpdates.push({
							_id: tile.id,
							img: uploaded,
						});
					}
				}
			}
			if (shownGroup) {
				console.groupEnd();
			}
			if (tileUpdates.length && !dryRun) {
				await scene.updateEmbeddedDocuments("Tile", tileUpdates);
			}
		}
		console.groupEnd();

		console.groupCollapsed("Uploading actors to Imgur...");
		for (const actor of game.actors) {
			if (actor.data.img?.startsWith(find)) {
				const uploaded = await upload(actor.data.img);
				if (uploaded) {
					console.log(`${actor.name}.img: ${actor.data.img} => ${actor.data.img.replace(find, uploaded)}`);
					if (!dryRun) await actor.update({ img: uploaded });
				}
			}
			if (actor.data.token.img?.startsWith(find)) {
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
			await htmlFields(actor, domParser, find);
			const itemUpdates = [];
			let shownGroup = false;
			for (const item of actor.data.items) {
				if (item.data.img?.startsWith(find)) {
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
				await htmlFields(item, domParser, find);
			}
			if (shownGroup) {
				console.groupEnd();
			}
			if (itemUpdates.length && !dryRun) {
				await actor.updateEmbeddedDocuments("Item", itemUpdates);
			}
			const effectUpdates = [];
			shownGroup = false;
			for (const effect of actor.data.effects) {
				if (effect.data.icon?.startsWith(find)) {
					const uploaded = upload(effect.data.icon);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${actor.name} effects`);
							shownGroup = true;
						}
						console.log(`${actor.name} ${effect.name} effect.img: ${effect.data.icon} => ${uploaded}`);
						effectUpdates.push({
							_id: effect.id,
							img: uploaded,
						});
					}
				}
			}
			if (shownGroup) {
				console.groupEnd();
			}
			if (effectUpdates.length && !dryRun) {
				await actor.updateEmbeddedDocuments("ActiveEffect", effectUpdates);
			}
		}
		console.groupEnd();

		console.groupCollapsed("Uploading items to Imgur...");
		for (const item of game.items) {
			if (item.data.img?.startsWith(find)) {
				const uploaded = await upload(item.data.img);
				if (uploaded) {
					console.log(`${item.name}.img: ${item.data.img} => ${item.data.img.replace(find, uploaded)}`);
					if (!dryRun) {
						await item.update({ img: uploaded });
					}
				}
			}
			await htmlFields(item, domParser, find);
			const effectUpdates = [];
			let shownGroup = false;
			for (const effect of item.data.effects) {
				if (effect.data.icon?.startsWith(find)) {
					const uploaded = upload(effect.data.icon);
					if (uploaded) {
						if (!shownGroup) {
							console.groupCollapsed(`${item.name} effects`);
							shownGroup = true;
						}
						console.log(`${item.name} ${effect.name} effect.img: ${effect.data.icon} => ${uploaded}`);
						effectUpdates.push({
							_id: effect.id,
							img: uploaded,
						});
					}
				}
			}
			if (shownGroup) {
				console.groupEnd();
			}
			if (effectUpdates.length && !dryRun) {
				await item.updateEmbeddedDocuments("ActiveEffect", effectUpdates);
			}
		}
		console.groupEnd();

		console.groupCollapsed("Uploading journals to Imgur...");
		for (const journal of game.journal) {
			if (journal.data.img?.startsWith(find)) {
				const uploaded = await upload(journal.data.img);
				if (uploaded) {
					console.log(`${journal.name}.img: ${journal.data.img} => ${uploaded}`);
					if (!dryRun) {
						await journal.update({
							img: uploaded,
						});
					}
				}
			}
			if (journal.data.content) {
				let hasContentUpdate = false;
				const doc = domParser.parseFromString(journal.data.content, "text/html");
				for (const link of doc.getElementsByTagName("img")) {
					if (link.src?.includes(find)) {
						const uploaded = await upload(link.src);
						if (uploaded) {
							console.log(
								`${journal.name}.img: ${link.src} => ${link.src.replace(find, uploaded)}` //TODO: Don't use replace, override
							);
							link.src = link.src.replace(find, uploaded);
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
		//[...document.styleSheets].map(sheet => [...sheet.cssRules]).flat()
		// TODO v2 - remove some duplicate code above

		/**
		 * Uploads the images in the HTML fields of a given document
		 * @param {Actor | Item} document
		 * @param {DOMParser} domParser
		 * @param {string} find
		 */
		async function htmlFields(document: Actor | Item, domParser: DOMParser, find: string) {
			if (!(game instanceof Game)) return;

			// @ts-expect-error
			const fields = game.system.template[document.documentName]?.htmlFields;

			if (fields && fields.length !== 0) {
				for (const field of fields) {
					const content = getProperty(document.data.data, field);
					if (content) {
						let hasContentUpdate = false;
						const doc = domParser.parseFromString(content, "text/html");
						for (const link of doc.getElementsByTagName("img")) {
							if (link.src?.includes(find)) {
								const uploaded = await upload(link.src);
								if (uploaded) {
									console.log(
										`${document.name}.${field}.img: ${link.src} => ${link.src.replace(
											find,
											uploaded
										)}`
									);
									link.src = link.src.replace(find, uploaded);
									hasContentUpdate = true;
								}
							}
						}

						for (const hasStyle of [
							...[...doc.styleSheets].map(sheet => [...sheet.cssRules]).flat(),
							...doc.getElementsByTagName("*"),
						]) {
							if (hasStyle instanceof CSSStyleRule || hasStyle instanceof HTMLElement) {
								for (const location of [
									"backgroundImage",
									"listStyleImage",
									"borderImageSource",
								] as const) {
									const url = hasStyle.style?.[location]?.match(/url\(["']?([^"']*)["']?\)/i)?.[1];
									if (url?.startsWith(find)) {
										const uploaded = await upload(url);
										if (uploaded) {
											console.log(
												`${(hasStyle as CSSStyleRule).selectorText ??
												(hasStyle as HTMLElement).tagName
												}.style: ${hasStyle.style?.[location]} => ${hasStyle.style?.[
													location
												].replace(find, uploaded)}`
											);
											hasStyle.style[location] = hasStyle.style?.[location].replace(
												find,
												uploaded
											);
											hasContentUpdate = true;
										}
									}
								}
							}
						}

						if (hasContentUpdate && !dryRun) {
							await document.update({
								[`data.${field}`]: doc.body.innerHTML,
							});
						}
					}
				}
			}
		}
	}
}
