# WebAwesome SSR & Reactivity Testing

This repository contains proof-of-concept applications to test how the [WebAwesome](https://webawesome.com/) component library interacts with Svelte reactivity and SvelteKit's Server-Side Rendering (SSR).

## Purpose

To isolate and understand specific behaviors when using WebAwesome custom elements in Svelte/SvelteKit applications, particularly around:
- Component initialization timing
- Reactive property updates
- SSR hydration
- Flash of unstyled content (FOUCE)

These tests aim to solve issues observed in production applications by creating minimal reproducible examples.

## Test Scenarios

### 1. CDN vs Bundling

**Objective**: Compare behavior differences between loading WebAwesome via CDN vs npm package bundling.

**Test Variations**:
- [ ] CDN: Script tag in `app.html`
- [ ] Bundled: npm package imported in application code

**Key Questions**:
- Does initialization timing differ?
- Are there differences in tree-shaking/bundle size?
- How does each approach handle hydration?

### 2. Reactive Disabled Property

**Objective**: Test `wa-select` component with `disabled` property controlled by a reactive variable.

**Test Variations**:
| Approach | SSR | Hydration | Expected Behavior |
|----------|-----|-----------|-------------------|
| Plain Svelte | No | No | Disabled state reflects variable on first load |
| SvelteKit (CSR) | No | Yes | Disabled state reflects variable on first load |
| SvelteKit (SSR) | Yes | Yes | Disabled state reflects variable on first load |

**Key Questions**:
- Does the disabled property sync correctly with reactive variables?
- Is there a timing mismatch between component registration and property binding?
- Does SSR pre-render the correct disabled state?
- Are there hydration mismatches?

**Known Issue**: The problem manifests when `isDisabled` is set to `false`, but the `wa-select` element remains disabled on initial load. This suggests a timing issue between custom element registration and Svelte's property binding.

**Example Code**:
```svelte
<script>
  // BUG: isDisabled = false, but element is disabled on first load
  let isDisabled = false;
</script>

<wa-select disabled={isDisabled}>
  <wa-option value="1">Option 1</wa-option>
  <wa-option value="2">Option 2</wa-option>
</wa-select>

<button on:click={() => isDisabled = !isDisabled}>
  Toggle Disabled
</button>
```

### 3. Flash of Unstyled Custom Elements (FOUCE)

**Objective**: Document and measure the flash of unstyled content when custom elements load.

**Test Variations**:
- [ ] `wa-select` with 10 options
- [ ] `wa-select` with 100+ options
- [ ] `wa-select` with 1000+ options
- [ ] Multiple custom elements on one page

**Key Questions**:
- How long is the FOUCE duration?
- Does SSR reduce or eliminate FOUCE?
- Do CSS custom properties help?
- Are there loading strategies (defer, async, preload) that help?

**Metrics to Capture**:
- Time from page load to custom elements defined
- Time from page load to custom elements styled
- Visual stability metrics

## POC Structure

```
/pocs
  /01-cdn-basic          # WebAwesome via CDN, full SSR
  /02-bundled-basic      # WebAwesome via npm (bundled), full SSR
  /03-plain-svelte       # Plain Svelte (no SSR), CDN
  /04-sveltekit-csr      # SvelteKit with SSR disabled, CDN
  /05-sveltekit-ssr      # SvelteKit with full SSR, CDN
  /06-fouce-test         # FOUCE measurement test, CDN
  /07-bundled-no-fouce   # Bundled + FOUCE prevention (BEST PRACTICES)
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

Install all dependencies for the monorepo:
```bash
npm install
```

### Running All POCs

Launch all POCs simultaneously in separate browser tabs:
```bash
npm run dev:all
```

This will start all 7 POCs on different ports and open them in your browser:
- POC 1 (CDN): http://localhost:5001
- POC 2 (Bundled): http://localhost:5002
- POC 3 (Plain Svelte): http://localhost:5003
- POC 4 (SvelteKit CSR): http://localhost:5004
- POC 5 (SvelteKit SSR): http://localhost:5005
- POC 6 (FOUCE Test): http://localhost:5006
- POC 7 (Bundled + No FOUCE): http://localhost:5007

### Running Individual POCs

```bash
npm run dev:01  # CDN basic
npm run dev:02  # Bundled basic
npm run dev:03  # Plain Svelte
npm run dev:04  # SvelteKit CSR
npm run dev:05  # SvelteKit SSR
npm run dev:06  # FOUCE test
npm run dev:07  # Bundled + No FOUCE (RECOMMENDED)
```

## Findings & Results

### CDN vs Bundling
**✅ RESOLVED**: Bundling via npm (`@awesome.me/webawesome`) **fixes the disabled property bug**!
- **CDN approach (POCs 1, 3-6)**: `disabled={false}` renders element as disabled
- **Bundled approach (POCs 2, 7)**: `disabled={false}` works correctly

**Root Cause**: CDN loading creates timing issues with Svelte's reactive property binding to custom elements.

**Recommendation**: Use bundled npm approach for production applications.

### Reactive Disabled Property
**Issue**: When using CDN, `wa-select` with `disabled={false}` incorrectly renders as disabled on initial load.

**Solution**: Import components via npm:
```javascript
import '@awesome.me/webawesome/dist/components/select/select.js';
import '@awesome.me/webawesome/dist/components/option/option.js';
```

### FOUCE Measurements
**Issue**: Flash of Unstyled Custom Elements occurs even with bundled approach.

**Solution**: POC 7 implements best practices:
1. Hide body with `opacity: 0` initially
2. Use `customElements.whenDefined()` to wait for all custom elements
3. Add 2-second timeout with `Promise.race()` to prevent indefinite loading
4. Fade in page smoothly when ready

See POC 7 for complete implementation.

## Related Issues

Document any related GitHub issues or discussions here:
-

## Resources

- [WebAwesome Documentation](https://webawesome.com/docs)
- [Svelte Custom Elements](https://svelte.dev/docs/custom-elements-api)
- [SvelteKit SSR](https://kit.svelte.dev/docs/page-options#ssr)
