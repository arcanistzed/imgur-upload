import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
// @ts-ignore
import ImgurAppShell from "./ImgurAppShell.svelte";

export default class ImgurSyncConfig extends SvelteApplication {
	/**
	 * Default Application options
	 *
	 * @returns {object} options - Application options.
	 * @see https://foundryvtt.com/api/Application.html#options
	 */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "imgur-sync.application.title",
			svelte: {
				class: ImgurAppShell,
				target: document.body,
			},
		});
	}
}
