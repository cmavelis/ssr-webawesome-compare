<script lang="ts">
	// Component imports and FOUCE prevention are handled in +layout.svelte
	// This keeps pages clean and DRY

	// BUG TEST: isDisabled = false, but element may be disabled on first load
	let isDisabled = $state(false);

	function toggleDisabled() {
		isDisabled = !isDisabled;
	}
</script>

<main style="padding: 2rem; max-width: 600px; margin: 0 auto;">
	<h1>POC 7: Bundled + No FOUCE (Root Layout)</h1>
	<p><strong>Test:</strong> wa-select with bundled npm approach and FOUCE prevention via root layout</p>

	<div style="margin: 2rem 0; padding: 1rem; background: #f0f8ff; border: 2px solid #4a90e2; border-radius: 4px;">
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

	<div style="margin-top: 3rem; padding: 1rem; background: #e8f5e9; border-radius: 4px;">
		<h3>Architecture: Root Layout Pattern</h3>
		<p>All WebAwesome component imports and FOUCE prevention logic are centralized in <code>+layout.svelte</code>:</p>
		<ul>
			<li><strong>✅ Single source of truth</strong> for component loading</li>
			<li><strong>✅ All pages automatically protected</strong> from FOUCE</li>
			<li><strong>✅ Easy to add new components</strong> - just update layout</li>
			<li><strong>✅ Clean page components</strong> - no duplicate imports</li>
		</ul>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #fff3cd; border-radius: 4px;">
		<h3>FOUCE Prevention Techniques (in +layout.svelte):</h3>
		<ul>
			<li><strong>CSS:</strong> Body hidden with <code>opacity: 0</code> until ready</li>
			<li><strong>JS:</strong> <code>customElements.whenDefined()</code> waits for all custom elements</li>
			<li><strong>Timeout:</strong> <code>Promise.race()</code> with 2-second fallback</li>
			<li><strong>Fade-in:</strong> Smooth 0.25s transition when adding <code>.ready</code> class</li>
		</ul>
	</div>

	<div style="margin-top: 2rem; padding: 1rem; background: #d1ecf1; border-radius: 4px;">
		<h3>Test Instructions:</h3>
		<ol>
			<li>Watch for page to fade in smoothly (no flash!)</li>
			<li>Select should be <strong>enabled</strong> on load (isDisabled = false)</li>
			<li>No flash of unstyled custom elements should occur</li>
			<li>Click toggle button to test reactivity</li>
			<li>Hard refresh (Cmd+Shift+R) to test again</li>
		</ol>
		<p><strong>Success Criteria:</strong> No FOUCE + Disabled property works correctly + Scalable architecture</p>
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
