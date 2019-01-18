export default {
    parser: 'babel-eslint',
    useEslintrc: false,
    cache: true,
    baseConfig: {
        env: {
            jest: true,
            browser: true,
            node: true,
        },
    },
    plugins: ['babel', 'import'],
    extends: 'eventbrite-react',
    rules: {
        'no-invalid-this': 'off',

        // dependencies live in the cli now, so we need to disable this rule
        'import/no-extraneous-dependencies': 'off',
        // apps using brite-cli are considered IPJ apps and should no longer depend on js/src/common
        'import/no-restricted-paths': [
            'error',
            {
                zones: [{target: './', from: '../../src/common/*'}],
            },
        ],
    },
    ignorePattern: ['/build/*', '/node_modules/*'],
};
