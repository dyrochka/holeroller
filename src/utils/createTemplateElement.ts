export function createTemplateElement(content: string) {
	const element = document.createElement('template');
	element.innerHTML = content;
	return element;
}
