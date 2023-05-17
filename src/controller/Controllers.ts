import {CustomController} from 'controller/CustomController';
import {ControllerType, detectControllerType} from 'controller/detectControllerType';
import './Controllers.scss';

export class Controllers {
	private static instance: Controllers;
	private types: Map<new () => any, {type: ControllerType}> = new Map();
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

	defineGamepad(target: new () => CustomController, settings: {type: ControllerType}) {
		this.types.set(target, settings);
	}

	add(gamepad: Gamepad) {
		if (this.cache.has(gamepad.id)) {
			return;
		}

		const el = this.createGamepad(gamepad);
		if (!el) {
			return;
		}

		this.cache.set(gamepad.id, {gamepadId: gamepad.id, el, cacheAxes: [], cacheButtons: []});
		document.querySelector('.controllers')?.appendChild(el);
		requestAnimationFrame(this.update);
	}

	remove(gamepad: Gamepad) {
		if (!this.cache.has(gamepad.id)) {
			return;
		}
		const state = this.cache.get(gamepad.id);
		if (state) {
			state.el.remove();
		}
		this.cache.delete(gamepad.id);
	}

	private createGamepad(gamepad: Gamepad) {
		const controllerType = detectControllerType(gamepad.id);
		for (const [Custom, {type}] of this.types) {
			if (type === controllerType) {
				return new Custom();
			}
		}
	}

	private update = () => {
		for (const gamepad of navigator.getGamepads()) {
			if (!gamepad || !this.cache.has(gamepad.id)) {
				continue;
			}
			const {id, buttons, axes} = gamepad;
			const cacheItem = this.cache.get(id);
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
