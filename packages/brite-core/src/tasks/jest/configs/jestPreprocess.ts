// tslint:disable-next-line:no-var-requires
module.exports = require('babel-jest').createTransformer({
  presets: ['env', 'stage-3', 'react'],
  plugins: [
    'dynamic-import-node',
    'transform-class-properties',
    [
      'transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true,
      },
    ],
  ],
});
