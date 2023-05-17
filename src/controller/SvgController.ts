import {CustomController} from 'controller/CustomController';

const axesStyleProperties = ['--left-x', '--left-y', '--right-x', '--right-y'];

export abstract class SvgController extends CustomController {
	buttons: (SVGElement | null)[] = [];
	axesPositions: number[] = [];

	abstract getSvgStyle(): HTMLTemplateElement;
	abstract getSvgTemplate(): HTMLTemplateElement;
	abstract getButtonIds(): string[];

	pupil: SVGPathElement | null;
	iris: SVGPathElement | null;


	connectedCallback() {
		this.attachShadow({mode: 'open'}).append(this.getSvgStyle().content.cloneNode(true));
		if (!this.shadowRoot) {
			return;
		}
		this.shadowRoot.append(this.getSvgTemplate().content.cloneNode(true));

		for (const value of this.getButtonIds()) { // Object.values(SonyPS5Buttons)) {
			const el = this.shadowRoot.querySelector('.' + value);
			this.buttons.push(el instanceof SVGElement ? el : null);
		}

		// extract axes coordinate from SVG
		const axesPositionBySVG: number[] = [];
		[
			this.shadowRoot.querySelector<SVGCircleElement>('.lxy > circle'),
			this.shadowRoot.querySelector<SVGCircleElement>('.rxy > circle'),
		].forEach((circle) => axesPositionBySVG.push(
			circle ? circle.cx.baseVal.value : 0,
			circle ? circle.cy.baseVal.value : 0
		));
		// console.warn('axesPositionBySVG', axesPositionBySVG, this.shadowRoot.querySelector<SVGCircleElement>('.lxy > circle:first-child'));
		// console.warn(this.shadowRoot.querySelector('.lxy > circle'));

		// extract axes coordinate from CSS
		const styles = getComputedStyle(this);
		const axesPositionByCSS = axesStyleProperties.map((property) => Number(styles.getPropertyValue(property)));

		axesStyleProperties.forEach((customProperty, id) => {
			const value = axesPositionByCSS[id] || axesPositionBySVG[id] || 0;
			this.axesPositions[id] = value;
			this.style.setProperty(customProperty, String(value));
		});

		// this.pupil = this.shadowRoot.querySelector('.pupil');
		// this.iris = this.shadowRoot.querySelector('.iris');
		// console.warn(this.pupil, this.iris);
	}

	updateButton(id: number, value: GamepadButton): void | Promise<void> {
		const button = this.buttons[id];
		if (!button) {
			return;
		}

		button.classList.toggle('pressed', value.pressed);
	}

	updateAxes(id: number, value: number) {
		this.style.setProperty(axesStyleProperties[id], `${(this.axesPositions[id] || 0) + value * 10}px`);
	}

	updateAllAxes(values: number[]) {
		const [lx, ly, rx, ry] = values.map((value) => Math.abs(value));
		// this.style.setProperty('--left-size', 1.2.toString());
		this.style.setProperty('--left-size', Math.max(Math.min((lx + ly) * 12, 12), 6).toString());
		this.style.setProperty('--right-size', Math.max(Math.min((rx + ry) * 12, 12), 6).toString());
		// this.style.setProperty('--left-size', (Math.max(Math.min(lx + ly, 0.1), 1.4)).toString());
		// this.style.setProperty('--right-size', (Math.random() * 2).toString());
	}
}
