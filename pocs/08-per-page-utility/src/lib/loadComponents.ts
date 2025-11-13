/**
 * WebAwesome Component Loader Utility
 *
 * A flexible utility for loading WebAwesome components on a per-page basis
 * with FOUCE (Flash of Unstyled Custom Elements) prevention.
 *
 * Inspired by:
 * - CSS-Tricks: An Approach to Lazy Loading Custom Elements
 * - @codewithkyle/lazy-loader patterns
 * - Web Components best practices
 */

export interface ComponentConfig {
	/** The custom element tag name (e.g., 'wa-select') */
	tagName: string;
	/** Optional: Override the default import path */
	importPath?: string;
}

export interface LoadOptions {
	/** Timeout in milliseconds before showing content anyway (default: 2000) */
	timeout?: number;
	/** Whether to add .ready class to body when done (default: true) */
	applyReadyClass?: boolean;
	/** Optional callback when components are loaded */
	onLoad?: () => void;
	/** Optional callback if timeout occurs */
	onTimeout?: () => void;
}

/**
 * Load WebAwesome components and wait for them to be defined
 *
 * @example
 * ```typescript
 * import { loadComponents } from '$lib/loadComponents';
 *
 * onMount(async () => {
 *   await loadComponents([
 *     { tagName: 'wa-select', importPath: '@awesome.me/webawesome/dist/components/select/select.js' },
 *     { tagName: 'wa-option', importPath: '@awesome.me/webawesome/dist/components/option/option.js' }
 *   ]);
 * });
 * ```
 */
export async function loadComponents(
	components: ComponentConfig[],
	options: LoadOptions = {}
): Promise<void> {
	const {
		timeout = 2000,
		applyReadyClass = true,
		onLoad,
		onTimeout
	} = options;

	// Import all component modules
	const importPromises = components.map(async ({ importPath }) => {
		if (importPath) {
			try {
				await import(/* @vite-ignore */ importPath);
			} catch (error) {
				console.error(`Failed to load component from ${importPath}:`, error);
			}
		}
	});

	// Wait for all imports to complete
	await Promise.all(importPromises);

	// Wait for custom elements to be defined
	const definedPromises = components.map(({ tagName }) =>
		customElements.whenDefined(tagName)
	);

	// Race between all components being defined and timeout
	const result = await Promise.race([
		Promise.allSettled(definedPromises).then(() => 'loaded'),
		new Promise<'timeout'>(resolve => setTimeout(() => resolve('timeout'), timeout))
	]);

	// Apply ready class to body if requested
	if (applyReadyClass && typeof document !== 'undefined') {
		document.body.classList.add('ready');
	}

	// Call appropriate callback
	if (result === 'loaded' && onLoad) {
		onLoad();
	} else if (result === 'timeout' && onTimeout) {
		onTimeout();
	}
}

/**
 * Helper to generate component config with default import paths
 *
 * @example
 * ```typescript
 * const components = createComponentConfig(['select', 'option', 'button']);
 * await loadComponents(components);
 * ```
 */
export function createComponentConfig(componentNames: string[]): ComponentConfig[] {
	return componentNames.map(name => ({
		tagName: `wa-${name}`,
		importPath: `@awesome.me/webawesome/dist/components/${name}/${name}.js`
	}));
}

/**
 * Preload components without waiting for them to be defined
 * Useful for prefetching components that will be used on future pages
 *
 * @example
 * ```typescript
 * // Preload components for next page
 * preloadComponents(['button', 'input']);
 * ```
 */
export async function preloadComponents(componentNames: string[]): Promise<void> {
	const components = createComponentConfig(componentNames);
	const importPromises = components.map(async ({ importPath }) => {
		if (importPath) {
			try {
				await import(/* @vite-ignore */ importPath);
			} catch (error) {
				console.error(`Failed to preload component from ${importPath}:`, error);
			}
		}
	});
	await Promise.all(importPromises);
}
