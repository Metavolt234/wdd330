export default [
  {
    files: ['src/**/*.js', 'src/**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
];
