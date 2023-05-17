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
	return {
		gamepad: styles.getPropertyValue('gamepad'),
		a: styles.getPropertyValue('color-primary'),
	};
}
export const config = getConfig();
