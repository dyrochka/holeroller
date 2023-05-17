export enum ControllerType {
	Default,
	NintendoSwitchPro,
	NintendoSwitchJoyCon,
	SonyDualSense,
	SonyDualShock4,
	SonyDualShock3,
	XboxOne,
	Xbox360,
	XboxWireless,
	XboxController,
	GoogleStadia,
}

enum ControllerVendor {
	Nintendo = '057e',
	Sony = '054c',
	Xbox = '045e',
	Google = '18d1',
}

type ControllerListType = [name: ControllerType, vendor: ControllerVendor, products: string]
	| [name: ControllerType, regexp: RegExp]
	| [name: ControllerType.Default];

const TYPE = 0;
const REGEXP = 1;
const VENDOR = 1;
const PRODUCT = 2;

const ControllerList: ControllerListType[] = [
	// Nintendo
	[ControllerType.NintendoSwitchPro, ControllerVendor.Nintendo, '2009'],
	[ControllerType.NintendoSwitchJoyCon, ControllerVendor.Nintendo, '200e'],
	// Sony
	[ControllerType.SonyDualSense, ControllerVendor.Sony, '2009'],
	[ControllerType.SonyDualSense, ControllerVendor.Sony, '0ce6'],
	[ControllerType.SonyDualShock4, ControllerVendor.Sony, '05c4'],
	[ControllerType.SonyDualShock4, ControllerVendor.Sony, '09cc'],
	[ControllerType.SonyDualShock3, ControllerVendor.Sony, '0268'],
	// Xbox
	[ControllerType.XboxOne, ControllerVendor.Xbox, '02ea'],
	[ControllerType.Xbox360, ControllerVendor.Xbox, '028e'],
	[ControllerType.XboxWireless, ControllerVendor.Xbox, '02e0'],
	[ControllerType.XboxController, /Xbox/],
	// Google
	[ControllerType.GoogleStadia, ControllerVendor.Google, '9400'],
	// Default
	[ControllerType.Default],
];

export function detectControllerType(gamepadId: string): ControllerType {
	const match = gamepadId.match(/Vendor: (?<vendor>[\da-f]{1,4}) Product: (?<product>[\da-f]{1,4})/)
		|| gamepadId.match(/^(?<vendor>[\da-f]{1,4})-(?<product>[\da-f]{1,4})/);
	const vendor = match?.groups?.vendor;
	const product = match?.groups?.product;
	for (const controllerType of ControllerList) {
		if (controllerType[REGEXP] instanceof RegExp) {
			if (gamepadId.match(controllerType[REGEXP])) {
				return controllerType[TYPE];
			}
			continue;
		}
		if (controllerType[VENDOR] && vendor === controllerType[VENDOR] && product === controllerType[PRODUCT]) {
			return controllerType[TYPE];
		}
	}
	return ControllerType.Default;
}
