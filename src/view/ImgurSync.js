import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import ImgurSyncShell from "./ImgurSync.svelte";
import ProgressBar from "./ProgressBar.svelte";

export default class ImgurSync extends SvelteApplication {
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
				class: ImgurSyncShell,
				target: document.body,
			},
			headerNoTitleMinimized: true,
		});
	}

	/** @inheritdoc */
	_getHeaderButtons() {
		const buttons = super._getHeaderButtons();
		buttons.unshift(ProgressBar);
		return buttons;
	}
}
