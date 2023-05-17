/** @type {import('esbuild').BuildOptions} */
export const esbuildOptions = {
	entryPoints: ['./src/index.ts'],
	bundle: true,
	outdir: 'lib',
	platform: 'browser',
	format: 'iife',
	minifySyntax: true,
	tsconfig: './tsconfig.json',
	external: ['./node_modules/*',],
};
