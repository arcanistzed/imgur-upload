<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script lang="ts">
	// @ts-expect-error
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	export let elementRoot: HTMLElement;

	import uploadImages from "../upload.js";

	const documentTypes = Object.keys(game.system.documentTypes);
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
	<main>
		<ul>
			<!-- svelte-ignore missing-declaration -->
			{#each documentTypes as document}
				<li><label><input type="checkbox" />{document}</label></li>
			{/each}
		</ul>

		<button on:click={() => uploadImages(false)}><i class="fas fa-photo-video" /> Imgur Upload</button>
	</main>
</ApplicationShell>

<style lang="scss" scoped>
	main {
		display: flex;
		flex-direction: column;
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
