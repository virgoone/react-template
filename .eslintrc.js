module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: [
    'prettier/react',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    'react/display-name': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'no-control-regex': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.less'],
      },
    },
  },
  globals: {
    __DEV__: true,
    __webpack_public_path__: true,
    __APP_LOADED__: true,
    APP_ENV: true,
  },
}