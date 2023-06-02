import {ControllerType} from 'controller/detectControllerType';

export function getControllerTypeByStyle(gamepad: Gamepad): ControllerType | undefined {
	const fake = document.createElement('div');
	fake.dataset.index = String(gamepad.index);
	document.body.append(fake);
	const fadeStyles = getComputedStyle(fake);
	const typePriority = fadeStyles
		.getPropertyValue('--type')
		.replace(/^"(.*)"$/, '$1');
	fake.remove();
	return typePriority in ControllerType ? ControllerType[typePriority as any] as any as ControllerType : undefined;
}