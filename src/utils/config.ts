/**
 * ```css
 * :root {
 *     --gamepad-1: 'dualsense';
 *     --gamepad-1: 'xbox-once';
 *     --gamepad: 'dualsense';
 * }
 * ```
 */
function getConfig() {
	const styles = getComputedStyle(document.body);
	console.warn(styles.getPropertyValue('color-primary-900'))
	return {
		gamepad: styles.getPropertyValue('gamepad'),
		// a: styles.getPropertyValue('color-primary'),
		colorPrimary900: styles.getPropertyValue('color-primary-900'),
		colorPrimary800: styles.getPropertyValue('color-primary-800'),
		colorPrimary700: styles.getPropertyValue('color-primary-700'),
	};
}

// CSS Relative colors polyfill
function correctFrom() {
	const styles = getComputedStyle(document.body);
	styles.getPropertyValue('color-primary-900')
}
export const config = getConfig();
