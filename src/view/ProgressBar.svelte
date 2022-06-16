<script>
    import { getContext } from "svelte";
	console.log(getContext("external"));
</script>

<progress class="keep-minimized" />

<style>
	progress {
		margin: auto;
		accent-color: var(--color-border-highlight, orangered);
	}
</style>
