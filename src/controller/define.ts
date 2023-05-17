import {Controllers} from 'controller/Controllers';
import {ControllerType} from 'controller/detectControllerType';

export function define({type = ControllerType.Default}: {type?: ControllerType}) {
	return function (target: any, _context?: ClassDecoratorContext<new (...args: any[]) => any>) {
		const tagName = `gamepad-${ControllerType[type].toLowerCase()}-01`;
		customElements.define(tagName, target);
		Controllers.getInstance().defineGamepad(target, {
			type,
		});
	};
}
