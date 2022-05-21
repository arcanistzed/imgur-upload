<script>
    import { getContext } from "svelte";
	console.log(getContext("external"));
</script>

<progress class="keep-minimized" />

<style scoped>
	progress {
		margin: auto;
		accent-color: var(--color-border-highlight, orangered);
	}
</style>
