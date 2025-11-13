<script lang="ts">
	import { onMount } from 'svelte';

	// Import WebAwesome styles
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	// Import WebAwesome components (cherry-picked)
	import '@awesome.me/webawesome/dist/components/select/select.js';
	import '@awesome.me/webawesome/dist/components/option/option.js';

	// BUG TEST: isDisabled = false, but element may be disabled on first load
	let isDisabled = $state(false);
	let elementsReady = $state(false);

	onMount(async () => {
		// FOUCE Prevention: Wait for custom elements to be defined
		// Use Promise.race to timeout after 2 seconds if elements don't load
		await Promise.race([
			// Wait for all custom elements we're using
			Promise.allSettled([
				customElements.whenDefined('wa-select'),
				customElements.whenDefined('wa-option')
			]),
			// Timeout after 2 seconds
			new Promise(resolve => setTimeout(resolve, 2000))
		]);

		// Mark elements as ready and show the page
		elementsReady = true;
		document.body.classList.add('ready');
	});

	function toggleDisabled() {
		isDisabled = !isDisabled;
	}
</script>

<main style="padding: 2rem; max-width: 600px; margin: 0 auto;">
	<h1>POC 7: Bundled + No FOUCE</h1>
	<p><strong>Test:</strong> wa-select with bundled npm approach and FOUCE prevention</p>

	<div style="margin: 2rem 0; padding: 1rem; background: #f0f8ff; border: 2px solid #4a90e2; border-radius: 4px;">
		<p><strong>Current State:</strong></p>
		<p>isDisabled = <code>{isDisabled}</code></p>
		<p>Elements Ready = <code>{elementsReady}</code></p>
		<p>Expected: Select should be {isDisabled ? 'disabled' : 'enabled'}</p>
	</div>

	<div style="margin: 2rem 0;">
		<label for="test-select">Test Select:</label>
		<wa-select id="test-select" disabled={isDisabled} style="margin-top: 0.5rem;">
			<wa-option value="1">Option 1</wa-option>
			<wa-option value="2">Option 2</wa-option>
			<wa-option value="3">Option 3</wa-option>
		</wa-select>
	</div>

	<button onclick={toggleDisabled} style="padding: 0.5rem 1rem; cursor: pointer;">
		Toggle Disabled (Current: {isDisabled})
	</button>

	<div style="margin-top: 3rem; padding: 1rem; background: #e8f5e9; border-radius: 4px;">
		<h3>FOUCE Prevention Techniques:</h3>
		<ul>
			<li><strong>CSS:</strong> Body hidden with <code>opacity: 0</code> until ready</li>
			<li><strong>JS:</strong> <code>customElements.whenDefined()</code> waits for all custom elements</li>
			<li><strong>Timeout:</strong> <code>Promise.race()</code> with 2-second fallback</li>
			<li><strong>Fade-in:</strong> Smooth 0.25s transition when adding <code>.ready</code> class</li>
		</ul>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #fff3cd; border-radius: 4px;">
		<h3>Test Instructions:</h3>
		<ol>
			<li>Watch for page to fade in smoothly (no flash!)</li>
			<li>Select should be <strong>enabled</strong> on load (isDisabled = false)</li>
			<li>No flash of unstyled custom elements should occur</li>
			<li>Click toggle button to test reactivity</li>
			<li>Hard refresh (Cmd+Shift+R) to test again</li>
		</ol>
		<p><strong>Success Criteria:</strong> No FOUCE + Disabled property works correctly</p>
	</div>
</main>

<style>
	main {
		font-family: system-ui, -apple-system, sans-serif;
	}

	code {
		background: #e0e0e0;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: monospace;
		font-weight: bold;
	}
</style>
