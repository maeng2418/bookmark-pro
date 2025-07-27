import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    // Common ignores for all projects
    ignores: ["dist/**", "node_modules/**", "**/*.config.js", ".next/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      // Common rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'off', // Often too strict, can be re-enabled per project if needed
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+ JSX transform
      'react/jsx-uses-react': 'off', // Not needed for React 17+ JSX transform
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },
];
