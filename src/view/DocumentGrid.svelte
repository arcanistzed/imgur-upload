<script>
	import Toggle from "./Toggle.svelte";

	const documentTypes = Object.keys(game.system.documentTypes);
	let selection = Object.fromEntries(documentTypes.map(k => [k, false ]));
</script>

<Toggle bind:selection={selection} />
<ul>
	{#each documentTypes as document}
		<li>
			<input id="imgur-upload-document-{document}" type="checkbox" bind:checked={selection[document]} />
			<label for="imgur-upload-document-{document}">{document}</label>
		</li>
	{/each}
</ul>

<style scoped>
	ul {
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}

	li {
		list-style: none;
	}
</style>
