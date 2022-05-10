<script>
	let allSelected = false;
	let selected = {};
	const documentTypes = Object.keys(game.system.documentTypes);

	function toggleSelection() {
		// Toggle variable
		allSelected = !allSelected;
		// Update selection state for all documents
		documentTypes.forEach(d => (selected[d] = allSelected ? true : false));
	}
</script>

<button type="button" on:click={toggleSelection}>
	{allSelected ? "Deselect All" : "Select All"}
</button>

<style lang="scss" scoped>
	button {
		background: none;
		width: fit-content;
	}
</style>
