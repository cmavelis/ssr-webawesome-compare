<script lang="ts">
  // BUG TEST: isDisabled = false, but element may be disabled on first load
  let isDisabled = $state(false);

  function toggleDisabled() {
    isDisabled = !isDisabled;
  }
</script>

<main>
  <h1>POC 3: Plain Svelte (No SSR)</h1>
  <p><strong>Test:</strong> wa-select with reactive disabled property (No SSR, No Hydration)</p>

  <div class="status">
    <p><strong>Current State:</strong></p>
    <p>isDisabled = <code>{isDisabled}</code></p>
    <p>Expected: Select should be {isDisabled ? 'disabled' : 'enabled'}</p>
  </div>

  <div class="test-area">
    <label for="test-select">Test Select:</label>
    <wa-select id="test-select" disabled={isDisabled}>
      <wa-option value="1">Option 1</wa-option>
      <wa-option value="2">Option 2</wa-option>
      <wa-option value="3">Option 3</wa-option>
    </wa-select>
  </div>

  <button onclick={toggleDisabled}>
    Toggle Disabled (Current: {isDisabled})
  </button>

  <div class="instructions">
    <h3>Test Instructions:</h3>
    <ol>
      <li>This is plain Svelte with NO server-side rendering</li>
      <li>On first page load, the select should be <strong>enabled</strong> (isDisabled = false)</li>
      <li>Click the toggle button to disable it</li>
      <li>Click again to enable it</li>
      <li>Refresh the page and observe the initial state</li>
    </ol>
    <p><strong>Note:</strong> This tests whether the issue appears without SSR/hydration.</p>
    <p><strong>Known Issue:</strong> If the select appears disabled despite isDisabled = false, the issue is NOT SSR-related.</p>
  </div>
</main>

<style>
  main {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .status {
    margin: 2rem 0;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .test-area {
    margin: 2rem 0;
  }

  .test-area label {
    display: block;
    margin-bottom: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    cursor: pointer;
    background: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
  }

  button:hover {
    background: #0052a3;
  }

  .instructions {
    margin-top: 3rem;
    padding: 1rem;
    background: #fff3cd;
    border-radius: 4px;
  }

  .instructions h3 {
    margin-top: 0;
  }

  code {
    background: #e0e0e0;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
  }
</style>
