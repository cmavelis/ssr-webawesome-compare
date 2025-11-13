<script lang="ts">
	// Import WebAwesome styles
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	// Import WebAwesome components (cherry-picked)
	import '@awesome.me/webawesome/dist/components/select/select.js';
	import '@awesome.me/webawesome/dist/components/option/option.js';

	// BUG TEST: isDisabled = false, but element may be disabled on first load
	let isDisabled = $state(false);

	function toggleDisabled() {
		isDisabled = !isDisabled;
	}
</script>

<main style="padding: 2rem; max-width: 600px; margin: 0 auto;">
	<h1>POC 2: Bundled via npm</h1>
	<p><strong>Test:</strong> wa-select with reactive disabled property (Bundled npm + Full SSR)</p>

	<div style="margin: 2rem 0; padding: 1rem; background: #f5f5f5; border-radius: 4px;">
		<p><strong>Current State:</strong></p>
		<p>isDisabled = <code>{isDisabled}</code></p>
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

	<div style="margin-top: 3rem; padding: 1rem; background: #fff3cd; border-radius: 4px;">
		<h3>Test Instructions:</h3>
		<ol>
			<li>WebAwesome is <strong>bundled via npm</strong> (not CDN)</li>
			<li>Components are cherry-picked and imported directly</li>
			<li>On first page load, the select should be <strong>enabled</strong> (isDisabled = false)</li>
			<li>Click the toggle button to disable it</li>
			<li>Click again to enable it</li>
			<li>Refresh the page and observe the initial state</li>
		</ol>
		<p><strong>Key Test:</strong> Does bundling fix the disabled property issue compared to CDN loading?</p>
		<p><strong>Known Issue:</strong> If the select appears disabled despite isDisabled = false, the issue exists with bundled approach too.</p>
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
	}
</style>
