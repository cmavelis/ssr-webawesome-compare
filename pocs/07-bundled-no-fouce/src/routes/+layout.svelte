<script lang="ts">
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';

	// Import WebAwesome styles (applies to all pages)
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	// Import all WebAwesome components used across the app (cherry-picked)
	import '@awesome.me/webawesome/dist/components/select/select.js';
	import '@awesome.me/webawesome/dist/components/option/option.js';
	// Add more components here as needed:
	// import '@awesome.me/webawesome/dist/components/button/button.js';
	// import '@awesome.me/webawesome/dist/components/input/input.js';

	let { children } = $props();
	let elementsReady = $state(false);

	onMount(async () => {
		// FOUCE Prevention: Wait for all custom elements to be defined
		// Use Promise.race to timeout after 2 seconds if elements don't load
		await Promise.race([
			// Wait for all custom elements used in the app
			Promise.allSettled([
				customElements.whenDefined('wa-select'),
				customElements.whenDefined('wa-option')
				// Add more custom elements here as needed
			]),
			// Timeout after 2 seconds to prevent indefinite loading
			new Promise(resolve => setTimeout(resolve, 2000))
		]);

		// Mark elements as ready and show the page
		elementsReady = true;
		document.body.classList.add('ready');
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
