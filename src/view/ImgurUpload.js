import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import ImgurUploadShell from "./ImgurUpload.svelte";
import ProgressBar from "./ProgressBar.svelte";

export default class ImgurUpload extends SvelteApplication {
	/**
	 * Default Application options
	 *
	 * @returns {object} options - Application options.
	 * @see https://foundryvtt.com/api/Application.html#options
	 */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: "imgur-upload.application.title",
			svelte: {
				class: ImgurUploadShell,
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
