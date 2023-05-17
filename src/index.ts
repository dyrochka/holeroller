import {Controllers} from 'controller/Controllers';
import 'controller/Sony/DualSense';
import 'controller/Sony/DualShock4';
import 'controller/Nintendo/SwitchPro';
import './index.scss';

const gamepads = Controllers.getInstance();

window.addEventListener('gamepadconnected', (event) => gamepads.add(event.gamepad));
window.addEventListener('gamepaddisconnected', (event) => gamepads.remove(event.gamepad));

for (const gamepad of navigator.getGamepads()) {
	gamepad && gamepads.add(gamepad);
}
