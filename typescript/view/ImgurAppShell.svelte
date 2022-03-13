<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script lang="ts">
	// @ts-expect-error
	import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
	export let elementRoot: any;

	let name: string;
	if (game instanceof Game) {
		name = game.actors?.getName("Other")?.data.name ?? "";
	}
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
	<main>
		<span>{name}</span>
	</main>
</ApplicationShell>

<style lang="scss">
	main {
		text-align: center;
		display: flex;
		flex-direction: column;
	}
</style>
