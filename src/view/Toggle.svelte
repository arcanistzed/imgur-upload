<script>
	let state = false;
	export let selection = {};

	function toggleSelection() {
		// Toggle state
		state = !state;

		// Update selection state for all documents
		for (const document in selection) {
			selection[document] = state ? true : false;
		}
	}
</script>

<button type="button" on:click={toggleSelection}>
	{state ? "Deselect All" : "Select All"}
</button>

<style>
	button {
		background: none;
		width: fit-content;
		align-self: end;
	}
</style>
