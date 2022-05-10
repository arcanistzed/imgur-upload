<script>
	let selected = {};
	const documentTypes = Object.keys(game.system.documentTypes);
</script>

<ul>
	{#each documentTypes as document}
		<li>
			<input id="imgur-sync-document-{document}" type="checkbox" bind:checked={selected[document]} />
			<label for="imgur-sync-document-{document}">{document}</label>
		</li>
	{/each}
</ul>

<style lang="scss" scoped>
	ul {
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}

	li {
		list-style: none;
	}
</style>
