<script lang="ts">
	import { onMount } from 'svelte';
	import { loadComponents, createComponentConfig } from '$lib/loadComponents';

	// BUG TEST: isDisabled = false, but element may be disabled on first load
	let isDisabled = $state(false);
	let loadTime = $state<number | null>(null);

	onMount(async () => {
		const startTime = performance.now();

		// Load only the components this page needs
		await loadComponents(
			createComponentConfig(['select', 'option']),
			{
				timeout: 2000,
				onLoad: () => {
					console.log('✅ All components loaded successfully');
					loadTime = performance.now() - startTime;
				},
				onTimeout: () => {
					console.warn('⏱️ Timeout reached, showing content anyway');
					loadTime = performance.now() - startTime;
				}
			}
		);
	});

	function toggleDisabled() {
		isDisabled = !isDisabled;
	}
</script>

<main style="padding: 2rem; max-width: 800px; margin: 0 auto;">
	<h1>POC 8: Per-Page Utility Pattern</h1>
	<p><strong>Test:</strong> wa-select with per-page component loading utility</p>

	<div style="margin: 2rem 0; padding: 1rem; background: #f0f8ff; border: 2px solid #4a90e2; border-radius: 4px;">
		<p><strong>Current State:</strong></p>
		<p>isDisabled = <code>{isDisabled}</code></p>
		{#if loadTime !== null}
			<p>Load Time = <code>{loadTime.toFixed(2)}ms</code></p>
		{/if}
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
		<h3>Per-Page Loading Utility</h3>
		<p>This POC demonstrates a flexible utility pattern for loading components on a per-page basis:</p>
		<pre style="background: #fff; padding: 1rem; overflow-x: auto; border-radius: 4px;"><code>import &#123; loadComponents, createComponentConfig &#125; from '$lib/loadComponents';

onMount(async () => &#123;
  await loadComponents(
    createComponentConfig(['select', 'option']),
    &#123;
      timeout: 2000,
      onLoad: () => console.log('Loaded!'),
      onTimeout: () => console.warn('Timeout!')
    &#125;
  );
&#125;);</code></pre>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #fff3cd; border-radius: 4px;">
		<h3>Utility Features:</h3>
		<ul>
			<li><strong>✅ Per-page loading</strong> - Only load what each page needs</li>
			<li><strong>✅ Code splitting</strong> - SvelteKit can split component bundles per route</li>
			<li><strong>✅ Configurable timeout</strong> - Customize wait time per page</li>
			<li><strong>✅ Callbacks</strong> - onLoad/onTimeout for custom handling</li>
			<li><strong>✅ Helper functions</strong> - createComponentConfig for DRY code</li>
			<li><strong>✅ Preloading support</strong> - preloadComponents for prefetching</li>
		</ul>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #d1ecf1; border-radius: 4px;">
		<h3>Advantages vs Root Layout (POC 7):</h3>
		<table style="width: 100%; border-collapse: collapse;">
			<thead>
				<tr style="background: #0aa; color: white;">
					<th style="padding: 0.5rem; text-align: left;">Aspect</th>
					<th style="padding: 0.5rem; text-align: left;">Root Layout</th>
					<th style="padding: 0.5rem; text-align: left;">Per-Page Utility</th>
				</tr>
			</thead>
			<tbody>
				<tr style="background: #f9f9f9;">
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Bundle Size</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">All components in initial bundle</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">✅ Only page-specific components</td>
				</tr>
				<tr>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Code Splitting</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Limited</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">✅ Full SvelteKit code splitting</td>
				</tr>
				<tr style="background: #f9f9f9;">
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Flexibility</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">One-size-fits-all timeout</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">✅ Per-page configuration</td>
				</tr>
				<tr>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Maintenance</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">✅ Single import location</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Import per page</td>
				</tr>
				<tr style="background: #f9f9f9;">
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Best For</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">Small apps, consistent component usage</td>
					<td style="padding: 0.5rem; border: 1px solid #ddd;">✅ Large apps, varied component usage</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #ffe6e6; border-radius: 4px;">
		<h3>Inspired By:</h3>
		<ul>
			<li><a href="https://css-tricks.com/an-approach-to-lazy-loading-custom-elements/" target="_blank" rel="noopener">CSS-Tricks: An Approach to Lazy Loading Custom Elements</a></li>
			<li><a href="https://github.com/codewithkyle/lazy-loader" target="_blank" rel="noopener">@codewithkyle/lazy-loader</a> - Lightweight Web Component lazy loading library</li>
			<li>Web Components auto-loader patterns with MutationObserver</li>
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
</style>
