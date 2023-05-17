import {resolve, basename, extname} from 'node:path';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {parse} from 'node-html-parser';

async function* getFiles(dir, source = '') {
	for (const dirent of await readdir(dir, {withFileTypes: true})) {
		const res = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* getFiles(res, source || dirent.name);
		} else if (extname(dirent.name) !== 'svg') {
			yield [res, source, basename(dirent.name, '.svg')];
		}
	}
}

for await (const [path, vendor, name] of getFiles('./src/figma/')) {
	const input = (await readFile(path, 'utf8'))
		// Figma adds a suffix to the same id
		.replaceAll(/id="(\w+)_2"/g, 'id="$1"')
		// replace id to class
		.replaceAll('id=', 'class=')
		// remove main group
		.replace(`${vendor}\\${name}`, '_unwrap');

	const root = parse(input);
	const svg = root.querySelector('svg');
	if (!svg) {
		throw new Error('not found svg');
	}
	const unwrap = svg.querySelector('._unwrap');
	if (unwrap) {
		svg.insertAdjacentHTML('beforeend', unwrap.innerHTML);
		unwrap.remove();
	}

	// flexible
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');

	// remove placeholder by Figma
	root.querySelector('svg > .Controllers').remove();
	root.querySelector('svg > rect').remove();

	for (const item of svg.querySelectorAll('path, circle, rect')) {
		item.removeAttribute('stroke');
		item.removeAttribute('stroke-opacity');
		item.removeAttribute('stroke-width');
		item.removeAttribute('stroke-linejoin');
		item.removeAttribute('stroke-miterlimit');
		item.removeAttribute('stroke-linecap');
		item.removeAttribute('fill');
		item.removeAttribute('fill-opacity');
	}

	// remove dublicated r1, l1
	for (const buttons of root.querySelectorAll('g[class="buttons"]')) {
		for (const g of buttons.querySelectorAll('g[class="l1"],g[class="r1"]')) {
			const paths = g.querySelectorAll('path');
			if (paths.length === 2 && paths[0].innerHTML === paths[1].innerHTML) {
				g.insertAdjacentHTML('afterend', `<path class="${g.classList}" ${paths[0].rawAttrs}/>`);
				g.remove();
			}
		}
	}

	let level = 0;
	const opened = [];

	const result = root.toString()
		// closest svg
		.replaceAll(/<(\w+)+(( [\w-]+="[^"]+")+)?><\/\1>/g, '<$1$2/>')
		// remove empty lines
		.replaceAll(/^\s*\n/gm, '')
		.split('\n')
		.reverse()
		// add indent
		.reduce((indented, elTag) => {
			if (opened.length
				&& level
				&& opened[level]
				// if current element tag is the same as previously opened one
				&& opened[level] === elTag.substring(1, opened[level].length + 1)
			) {
				opened.splice(level, 1);
				level--;
			}

			const indentation = '\t'.repeat(level ? level : 0);

			const newIndented = [`${indentation}${elTag}`, ...indented];

			// if current element tag is closing tag, add it to opened elements
			if (elTag.substring(0, 2) === '</') {
				level++;
				opened[level] = elTag.substring(2, elTag.length - 1);
			}

			return newIndented;
		}, [])
		.join('\n');

	await writeFile('./src/export/' + name + '.svg', result);
}
