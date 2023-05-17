import {context} from 'esbuild';
import {esbuildOptions} from './esbuildOptions.mjs';
import {readFile, writeFile} from 'node:fs/promises';
import {sassPlugin} from 'esbuild-sass-plugin';
import {minify} from 'csso';

const [ctx] = await Promise.all([context({
	...esbuildOptions,
	loader: {'.svg': 'text'},
	minify: true,
	write: false,
	plugins: [
		{
			name: 'bundle files',
			setup(build) {
				build.onEnd(async ({errors, outputFiles}) => {
					if (errors.length || !outputFiles?.length) {
						return;
					}
					const script = outputFiles.find((file) => file.path.endsWith('.js'))?.text;
					const file = (await readFile('./src/index.html', 'utf8'))
						.replace('<script></script>', `<script>${script?.toString()}</script>`)
					await writeFile('./lib/index.html', file);
				});
			},
		},
		// minification svg
		{
			name: 'svg-min',
			setup({onLoad}) {
				onLoad({filter: /\.svg$/}, async args => {
					const raw = await readFile(args.path, 'utf-8');
					return {contents: raw.replace(/\r\n|\r|\n/g, ''), loader: 'text'};
				});
			},
		},
		// embedded sass
		sassPlugin({
			// filter: /controller\/.*\.scss$/,
			// filter: /controller\/([^/]+\/)+.+\.scss$/,
			filter: /controller(\/[^/]+)+\/[^./]+\.scss$/,
			type: 'css-text',
			transform: (source) => minify(source).css,
		}),
		// main sass
		sassPlugin({
			filter: /\.scss$/,
			type: 'style',
			transform: (source) => minify(source).css,
		}),
	],
})]);

await ctx.watch({});