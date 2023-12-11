module.exports = {
  env: {
    browser: true,
    // commonjs: true,
    es2021: true,
  },
  extends: 'plugin:react/recommended',
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  plugins: ['import', 'jsx-a11y', 'react', 'react-hooks'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-plusplus': 'off',
    'camelcase': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
};
