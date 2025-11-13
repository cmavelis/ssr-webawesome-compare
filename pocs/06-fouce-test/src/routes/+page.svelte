<script lang="ts">
	import { onMount } from 'svelte';

	let pageLoadTime = $state(0);
	let customElementsDefinedTime = $state<number | null>(null);
	let waSelectDefinedTime = $state<number | null>(null);
	let performanceEntries = $state<string[]>([]);

	onMount(() => {
		const startTime = performance.now();
		pageLoadTime = startTime;

		// Check when custom elements are defined
		const checkInterval = setInterval(() => {
			if (customElements.get('wa-select') && !waSelectDefinedTime) {
				waSelectDefinedTime = performance.now() - startTime;
				customElementsDefinedTime = waSelectDefinedTime;
				clearInterval(checkInterval);

				// Collect performance entries
				const entries = performance.getEntriesByType('navigation');
				performanceEntries = entries.map(entry =>
					`${entry.name}: ${entry.duration.toFixed(2)}ms`
				);
			}
		}, 10);

		// Timeout after 5 seconds
		setTimeout(() => {
			clearInterval(checkInterval);
		}, 5000);
	});
</script>

<main style="padding: 2rem; max-width: 800px; margin: 0 auto;">
	<h1>POC 6: FOUCE Measurement Test</h1>
	<p><strong>Test:</strong> Flash of Unstyled Custom Elements (FOUCE)</p>

	<div style="margin: 2rem 0; padding: 1rem; background: #f0f8ff; border-radius: 4px; border: 2px solid #4a90e2;">
		<h3>Performance Metrics</h3>
		<p>Time until wa-select defined: <code>{waSelectDefinedTime !== null ? `${waSelectDefinedTime.toFixed(2)}ms` : 'Loading...'}</code></p>
		<p><strong>Observation:</strong> Watch for any visible flash or style shift when the page loads.</p>
	</div>

	<section style="margin: 3rem 0;">
		<h2>Test 1: Small Select (10 options)</h2>
		<wa-select>
			{#each Array(10) as _, i}
				<wa-option value={i + 1}>Option {i + 1}</wa-option>
			{/each}
		</wa-select>
	</section>

	<section style="margin: 3rem 0;">
		<h2>Test 2: Medium Select (100 options)</h2>
		<wa-select>
			{#each Array(100) as _, i}
				<wa-option value={i + 1}>Option {i + 1}</wa-option>
			{/each}
		</wa-select>
	</section>

	<section style="margin: 3rem 0;">
		<h2>Test 3: Large Select (500 options)</h2>
		<wa-select>
			{#each Array(500) as _, i}
				<wa-option value={i + 1}>Option {i + 1}</wa-option>
			{/each}
		</wa-select>
	</section>

	<section style="margin: 3rem 0;">
		<h2>Test 4: Multiple Elements</h2>
		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
			{#each Array(6) as _, i}
				<div>
					<label>Select {i + 1}</label>
					<wa-select>
						<wa-option value="1">Option 1</wa-option>
						<wa-option value="2">Option 2</wa-option>
						<wa-option value="3">Option 3</wa-option>
					</wa-select>
				</div>
			{/each}
		</div>
	</section>

	<div style="margin-top: 3rem; padding: 1rem; background: #fff3cd; border-radius: 4px;">
		<h3>Test Instructions:</h3>
		<ol>
			<li>Refresh the page and watch for visual changes/flashes</li>
			<li>Look for unstyled elements before they become styled</li>
			<li>Note the time it takes for custom elements to be defined</li>
			<li>Test on different network speeds (use browser DevTools throttling)</li>
			<li>Compare FOUCE duration across different scenarios</li>
		</ol>
		<h4>Things to observe:</h4>
		<ul>
			<li>Do the selects appear immediately styled, or is there a flash?</li>
			<li>Does the number of options affect FOUCE duration?</li>
			<li>Do multiple elements compound the issue?</li>
			<li>Is there layout shift when elements upgrade?</li>
		</ul>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #e8f5e9; border-radius: 4px;">
		<h3>Mitigation Strategies to Test:</h3>
		<ul>
			<li>Preload the WebAwesome script</li>
			<li>Use <code>:not(:defined)</code> CSS to style pre-upgrade elements</li>
			<li>Add skeleton/placeholder styles</li>
			<li>Use <code>customElements.whenDefined()</code> to control visibility</li>
		</ul>
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

	section {
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 4px;
		border: 1px solid #ddd;
	}

	section h2 {
		margin-top: 0;
		color: #333;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
		font-weight: 500;
	}
</style>
