export interface CustomController {
	disconnectedCallback?(): void;
	updateAllAxes?(values: number[]): void | Promise<void>;
}

export abstract class CustomController extends HTMLElement {
	abstract connectedCallback(): void;
	abstract updateButton(id: number, button: GamepadButton): void | Promise<void>;
	abstract updateAxes(id: number, value: any): void | Promise<void>;
}
