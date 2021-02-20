module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [ 'node', 'import' ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: [ 'node_modules', 'src' ],
        extensions: ['.js'],
      },
    },
  },
  rules: {
    'array-bracket-newline': [ 'warn', { 'multiline': true }],
    'array-bracket-spacing': [
      'error',
      'always',
      {
        'singleValue': false,
        'objectsInArrays': false,
        'arraysInArrays': false,
      },
    ],
    'array-element-newline': [ 'warn', { 'multiline': true, 'minItems': 3 }],
    'comma-dangle': [
      'warn',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never',
      },
    ],
    'import/order': 0,
    'import/imports-first': 2,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 0,
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
    'indent': [
      'error',
      2,
      { 'SwitchCase': 1 },
    ], // HUH ?? NOT WORKING 😡
    'linebreak-style': [ 'error', 'unix' ],
    'max-len': [
      'warn',
      {
        'code': 110,
        'tabWidth': 2,
        'ignoreTrailingComments': true,
        'ignoreUrls': true,
        'ignoreStrings': true,
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true,
      },
    ],
    'no-prototype-builtins': 0,
    'no-unused-vars': 0,
    'no-undef': 1,
    'object-curly-spacing': [
      'error',
      'always',
      {
        'arraysInObjects': false,
        'objectsInObjects': false,
      },
    ],
    'object-property-newline': [
      'error',
      {
        'allowAllPropertiesOnSameLine': true,
      },
    ],
    'semi': 2,
    'spaced-comment': 1,
    'quotes': [
      'error',
      'single',
      { 'avoidEscape': true },
    ],
  },
};
