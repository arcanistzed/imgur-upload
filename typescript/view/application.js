import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
// @ts-ignore
import ImgurAppShell from "./ImgurAppShell.svelte";

export default class ImgurApplication extends SvelteApplication {
	/**
	 * Default Application options
	 *
	 * @returns {object} options - Application options.
	 * @see https://foundryvtt.com/api/Application.html#options
	 */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "imgur-sync.application.title",
			width: 300,

			svelte: {
				class: ImgurAppShell,
				target: document.body,
			},
		});
	}
}
