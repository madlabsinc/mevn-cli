module.exports = {
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
  parser: 'babel-eslint',
  env: {
    'browser': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: {
      configFile: '.babelrc',
    },
  },
  rules: {
    'no-console': 0,
    'prettier/prettier': [ // customizing prettier rules (unfortunately not many of them are customizable)
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    eqeqeq: ['error', 'always'], // adding some custom ESLint rules
  },
};
