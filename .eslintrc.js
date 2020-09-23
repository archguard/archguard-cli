module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
  },
};
