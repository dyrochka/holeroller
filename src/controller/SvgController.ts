import {CustomController} from 'controller/CustomController';

const axesStyleProperties = ['--left-x', '--left-y', '--right-x', '--right-y'];

export abstract class SvgController extends CustomController {
	buttons: (SVGElement | null)[] = [];
	axesPositions: number[] = [];

	abstract getStyle(): HTMLTemplateElement;
	abstract getTemplate(): HTMLTemplateElement;
	abstract getButtonIds(): string[];

	pupil: SVGPathElement | null;
	iris: SVGPathElement | null;

	connectedCallback() {
		this.attachShadow({mode: 'open'});
		if (!this.shadowRoot) {
			return;
		}
		// add computed styles
		// const stylesByParent = getComputedStyle(this);
		// add style
		this.shadowRoot.append(this.getStyle().content.cloneNode(true));
		// add template
		this.shadowRoot.append(this.getTemplate().content.cloneNode(true));
		const styles = getComputedStyle(this);
		// styles.setProperty('--color-primary-900', '#ffff');
		// console.warn(this.parentElement.children)
		// console.warn('--color-primary-800', styles.getPropertyValue('--color-primary-800'))
		// this.shadowRoot.ge

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

		// extract axes coordinate from CSS
		const axesPositionByCSS = axesStyleProperties.map((property) => Number(styles.getPropertyValue(property)));

		axesStyleProperties.forEach((customProperty, id) => {
			const value = axesPositionByCSS[id] || axesPositionBySVG[id] || 0;
			this.axesPositions[id] = value;
			this.style.setProperty(customProperty, String(value));
		});
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
		this.style.setProperty('--left-size', Math.max(Math.min((lx + ly) * 12, 12), 6).toString());
		this.style.setProperty('--right-size', Math.max(Math.min((rx + ry) * 12, 12), 6).toString());
	}
}
