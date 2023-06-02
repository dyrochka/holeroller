import {ControllerType} from 'controller/detectControllerType';

export interface CustomController {
	disconnectedCallback?(): void;
	updateAllAxes?(values: number[]): void | Promise<void>;
}

export abstract class CustomController extends HTMLElement {
	index: number;
	abstract connectedCallback(): void;
	abstract updateButton(id: number, button: GamepadButton): void | Promise<void>;
	abstract updateAxes(id: number, value: any): void | Promise<void>;

	constructor(index: number, type: ControllerType) {
		super();
		this.index = index;
		this.dataset.index = String(index);
		this.dataset.type = String(ControllerType[type]);
	}
}
