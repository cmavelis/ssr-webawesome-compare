<script lang="ts">
	// BUG TEST: isDisabled = false, but element may be disabled on first load
	let isDisabled = $state(false);

	function toggleDisabled() {
		isDisabled = !isDisabled;
	}
</script>

<main style="padding: 2rem; max-width: 600px; margin: 0 auto;">
	<h1>POC 1: WebAwesome via CDN</h1>
	<p><strong>Test:</strong> wa-select with reactive disabled property (CDN + Full SSR)</p>

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
			<li>On first page load, the select should be <strong>enabled</strong> (isDisabled = false)</li>
			<li>Click the toggle button to disable it</li>
			<li>Click again to enable it</li>
			<li>Refresh the page and observe the initial state</li>
		</ol>
		<p><strong>Known Issue:</strong> If the select appears disabled despite isDisabled = false, there's a timing/binding issue.</p>
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
