module.exports = {
  root: true,
  env: { node: true, es6: true },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
  },
};

