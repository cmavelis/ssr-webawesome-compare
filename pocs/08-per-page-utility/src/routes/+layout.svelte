<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	// Import WebAwesome styles globally (shared across all pages)
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	// Components are loaded per-page using the utility
	// This keeps the layout lean and allows code splitting

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
