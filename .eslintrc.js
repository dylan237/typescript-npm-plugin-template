module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript',
    'plugin:react/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react'],
  // rules: {
  //   'no-param-reassign': 0,
  //   'react/forbid-prop-types': 0,
  //   'react/jsx-props-no-spreading': 0,
  //   'react/prop-types': [2, { ignore: ['children', 'theme'] }],
  //   'react/require-default-props': 0,
  //   'react/react-in-jsx-scope': 0,
  //   'react/jsx-curly-newline': 0,
  //   'react/jsx-filename-extension': [
  //     1,
  //     {
  //       extensions: ['.js', '.jsx'],
  //     },
  //   ],
  //   'import/prefer-default-export': 0,
  //   'import/no-extraneous-dependencies': 0,
  //   'import/order': [
  //     'error',
  //     {
  //       groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
  //       pathGroups: [
  //         {
  //           pattern: 'react',
  //           group: 'external',
  //           position: 'before',
  //         },
  //       ],
  //       pathGroupsExcludedImportTypes: ['react'],
  //       alphabetize: {
  //         order: 'asc',
  //         caseInsensitive: true,
  //       },
  //     },
  //   ],
  //   'no-unused-vars': 1,
  //   'no-console': 0,
  //   'no-plusplus': 0,
  // },
  env: {
    browser: true,
    node: true,
    es2021: true,
    commonjs: true,
  },
}
