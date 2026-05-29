import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '**/node_modules/',
    '**/out/',
    '**/.next/',
    '**/dist/',
    '**/volumes/',
    '**/__tests__/',
    'jest.config.js',
    'next.config.js',
    'postcss.config.js',
  ]),
  {
    rules: {
      indent: 'off',
      '@next/next/no-document-import-in-page': 'off',
      // Disable prop-types as we use TypeScript for type checking
      'react/prop-types': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-console': [
        2,
        {
          allow: ['warn', 'error', 'info'],
        },
      ],

      // needed for NextJS's jsx without react import
      'react/react-in-jsx-scope': 'off',
    },
  },
]);

export default eslintConfig;
