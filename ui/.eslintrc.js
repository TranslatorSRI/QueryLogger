const path = require('path');

module.exports = {
  extends: 'airbnb',
  plugins: ['react', 'jsx-a11y', 'import', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', path.join(path.resolve(__dirname), 'ui')],
        ],
        extensions: ['.jsx', '.js'],
      },
    },
    'import/core-modules': ['electron'],
  },
  overrides: [{
    files: ['*.jsx', '*.js'],
  }],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': 'off',
    camelcase: 'off',
    'linebreak-style': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-param-reassign': ['error', { props: false }],
    'operator-linebreak': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'react/sort-comp': [
      'error',
      {
        order: [
          'static-methods',
          'instance-variables',
          'lifecycle',
          'instance-methods',
          'everything-else',
          'rendering',
        ],
        groups: {
          rendering: ['/^render.+$/', 'render'],
        },
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/webpack*'],
      },
    ],
  },
};
