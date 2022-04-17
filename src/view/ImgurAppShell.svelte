<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	export let elementRoot;
	import uploadImages from "../upload.js";

	let allSelected = false;
	let selected = {};
	function toggleSelection() {
		// Toggle variable
		allSelected = !allSelected;
		// Update selection state for all documents
		documentTypes.forEach(d => (selected[d] = allSelected ? true : false));
	}

	let dryRun = false;
	const documentTypes = Object.keys(game.system.documentTypes);
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
	<main>
		<div class="controls">
			<button class="toggle" type="button" on:click={toggleSelection}>
				{allSelected ? "Deselect All" : "Select All"}
			</button>
		</div>
		<ul>
			<!-- svelte-ignore missing-declaration -->
			{#each documentTypes as document}
				<li>
					<input id="imgur-sync-document-{document}" type="checkbox" bind:checked={selected[document]} />
					<label for="imgur-sync-document-{document}">{document}</label>
				</li>
			{/each}
		</ul>
		<hr />
		<div class="form-group">
			<input id="imgur-sync-parse-css" type="checkbox" name="css" />
			<label for="imgur-sync-parse-css">Parse CSS?</label>
		</div>
		<div class="form-group">
			<input id="imgur-sync-dry-run" type="checkbox" name="dryrun" bind:checked={dryRun} />
			<label for="imgur-sync-dry-run">Dry Run?</label>
		</div>
		<hr />
		<button on:click={() => uploadImages(dryRun)}><i class="fas fa-photo-video" /> Imgur Upload</button>
	</main>
</ApplicationShell>

<style lang="scss" scoped>
	main {
		display: flex;
		flex-direction: column;
	}

	.controls {
		display: flex;
		justify-content: flex-end;
	}

	.toggle {
		background: none;
		width: fit-content;
	}

	ul {
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}
	li {
		list-style: none;
	}
</style>
