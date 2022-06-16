<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	import DocumentGrid from "./DocumentGrid.svelte";

	export let elementRoot;
	import uploadImages from "../upload.js";

	let dryRun = true;
	let parseHTML = true;
</script>

<ApplicationShell bind:elementRoot>
	<main>
		<DocumentGrid />
		<hr />
		<div class="form-group">
			<input id="imgur-upload-parse-html" type="checkbox" name="html" bind:checked={parseHTML} />
			<label for="imgur-upload-parse-html">Parse HTML?</label>
		</div>
		<div class="form-group">
			<input id="imgur-upload-dry-run" type="checkbox" name="dryrun" bind:checked={dryRun} />
			<label for="imgur-upload-dry-run">Dry Run?</label>
		</div>
		<hr />
		<button on:click={() => uploadImages(parseHTML, dryRun)}><i class="fas fa-photo-video" /> Imgur Upload</button>
	</main>
</ApplicationShell>

<style>
	main {
		display: flex;
		flex-direction: column;
	}
</style>
