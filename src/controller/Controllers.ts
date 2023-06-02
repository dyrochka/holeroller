import {CustomController} from 'controller/CustomController';
import {ControllerType, detectControllerType} from 'controller/detectControllerType';
import './Controllers.scss';
import {getControllerTypeByStyle} from 'controller/getControllerTypeByStyle';

export class Controllers {
	private static instance: Controllers;
	private types: Set<{
		Class: new (index: number, type: ControllerType) => CustomController,
		type: ControllerType,
	}> = new Set();
	private cache: Map<string, {
		gamepadId: string,
		el: CustomController,
		cacheButtons: { pressed: boolean, touched: boolean, value: number }[],
		cacheAxes: number[],
	}> = new Map();

	static getInstance() {
		if (Controllers.instance) {
			return Controllers.instance;
		}
		return Controllers.instance = new Controllers();
	}

	private constructor() { /* singleton, use Gamepads.getInstance() */ }

	defineGamepad(Class: new () => CustomController, settings: {type: ControllerType}) {
		this.types.add({
			Class,
			...settings
		});
	}

	add(gamepad: Gamepad) {
		const id = gamepad.id + gamepad.index;
		if (this.cache.has(id)) {
			return;
		}

		const el = this.createGamepad(gamepad);
		if (!el) {
			return;
		}

		this.cache.set(id, {gamepadId: id, el, cacheAxes: [], cacheButtons: []});
		document.querySelector('.controllers')?.appendChild(el);
		requestAnimationFrame(this.update);
	}

	remove(gamepad: Gamepad) {
		const id = gamepad.id + gamepad.index;
		if (!this.cache.has(id)) {
			return;
		}
		const state = this.cache.get(id);
		if (state) {
			state.el.remove();
		}
		this.cache.delete(id);
	}

	private createGamepad(gamepad: Gamepad) {
		const controllerType = getControllerTypeByStyle(gamepad)
			|| detectControllerType(gamepad.id);
		for (const {Class, type} of this.types) {
			if (type === controllerType) {
				return new Class(gamepad.index, type);
			}
		}
	}

	private update = () => {
		for (const gamepad of navigator.getGamepads()) {
			if (!gamepad) {
				continue;
			}
			const {id, index, buttons, axes} = gamepad;
			const gamepadId = id + index;
			const cacheItem = this.cache.get(gamepadId);
			if (!cacheItem || !cacheItem.el.isConnected) {
				continue;
			}

			const {el, cacheButtons, cacheAxes} = cacheItem;

			// detect change buttons
			buttons.forEach(({touched, value, pressed}, id) => {
				const cache = cacheButtons[id];
				if (!cache) {
					el.updateButton && el.updateButton(id, cacheButtons[id] = {touched, value, pressed});
					return;
				}
				if (cache.value === value && cache.pressed === pressed && cache.touched === touched) {
					return;
				}
				cache.value = value;
				cache.touched = touched;
				cache.pressed = pressed;
				el.updateButton && el.updateButton(id, cache);
			});

			// detect change axes
			let axesResultUpdated = false;
			const axesResult = axes.map((value, id) => {
				value = Number(value.toFixed(2));
				if (cacheAxes[id] === value) {
					return value;
				}
				el.updateAxes && el.updateAxes(id, cacheAxes[id] = value);
				axesResultUpdated = true;
				return value;
			});
			axesResultUpdated && el.updateAllAxes && el.updateAllAxes(axesResult);
		}

		requestAnimationFrame(this.update);
	};
}
