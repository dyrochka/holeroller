module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		project: ['./tsconfig.json'],
	},
	plugins: [
		'@typescript-eslint',
		'unicorn',
	],
	extends: [
		'yandex',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'unicorn/better-regex': 'error',
		'indent': ['error', 'tab', {'SwitchCase': 1, 'ignoredNodes': ['TemplateLiteral']}],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'operator-linebreak': ['error', 'before'],
		'no-shadow': 'off',
	},
	// overrides: [
	// ]
};
