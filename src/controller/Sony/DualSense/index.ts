import {define} from 'controller/define';
import {SvgController} from 'controller/SvgController';
import {ControllerType} from 'controller/detectControllerType';
import {SonyButtons} from 'controller/Sony/SonyButtons';
import {createTemplateElement} from 'utils/createTemplateElement';
import svgTemplate from 'export/DualSense.svg';
import svgStyle from 'controller/Sony/DualSense/index.scss';

@define({type: ControllerType.SonyDualSense})
class DualSense extends SvgController {
	getStyle = () => createTemplateElement(`<style>${svgStyle}</style>`);
	getTemplate = () => createTemplateElement(svgTemplate);
	getButtonIds = () => Object.values(SonyButtons).filter((value) => typeof value === 'string') as string[];

	// noinspection DuplicatedCode
	updateButton(id: SonyButtons, value: GamepadButton): void | Promise<void> {
		super.updateButton(id, value);
		const name = SonyButtons[id] as keyof typeof SonyButtons;
		const button = this.buttons[id];

		if (button && (name === 'l2' || name === 'r2')) {
			button.style.transform = `translate(0px, ${Math.round(value.value * 8).toString()}px)`;
		}
	}
}
