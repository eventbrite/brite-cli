module.exports = {
	parser: "babel-eslint",
	useEslintrc: false,
	cache: true,
	baseConfig: {
		env: {
			jest: true,
			browser: true,
			node: true,
		},
		extends: "eventbrite-react",
	},
	plugins: ["babel", "import"],
	rules: {
		"no-invalid-this": "off",

		// TODO: Is this still needed?
		// dependencies live in the cli now, so we need to disable this rule
		"import/no-extraneous-dependencies": "off",

		// TODO: Is this still needed?
		// apps using brite-cli are considered IPJ apps and should no longer depend on js/src/common
		"import/no-restricted-paths": [
			"error",
			{
				zones: [{ target: "./", from: "../../src/common/*" }],
			},
		],
	},
	ignorePattern: ["/build/*", "/node_modules/*"],
};
