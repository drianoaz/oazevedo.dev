import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended';
import { config as tsConfig, configs as tsConfigs } from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/**
 * Since eslint-plugin-import@2.32.0, the Flat config to TypeScript now includes the import plugin in its definitions.
 * This conflicts with Next.js' lint rules. This avoid the above error
 *
 * ConfigError: Config "import/typescript": Key "plugins": Cannot redefine plugin "import".
 */
const nextConfigWithoutImportPlugin = [
  importPlugin.flatConfigs.recommended,
  ...compat
    .config({
      extends: ['next/core-web-vitals'],
    })
    .map((item) => {
      if (item?.plugins?.['import']) {
        delete item.plugins['import'];
        return item;
      }

      return item;
    }),
];

export default tsConfig(
  eslint.configs.recommended,
  ...nextConfigWithoutImportPlugin,
  tsConfigs.recommended,
  prettierConfigRecommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [importPlugin.flatConfigs.typescript],
  },
  {
    rules: {
      /**
       * Such messages are considered to be for debugging purposes and therefore not
       * suitable to ship to the client. In general, calls using console should be
       * stripped before being pushed to production.
       *
       * @see https://eslint.org/docs/latest/rules/no-console
       */
      'no-console': 'error',

      /**
       * JavaScript allows the omission of curly braces when a block contains only one statement. However,
       * it is considered by many to be best practice to never omit curly braces around blocks, even when
       * they are optional, because it can lead to bugs and reduces code clarity and consistency.
       *
       * @see https://eslint.org/docs/latest/rules/curly
       */
      curly: 'error',

      /**
       * This rule avoid bugs by disallowing expressions where the operation doesn't affect the value
       * Comparisons which will always evaluate to true or false and logical expressions (||, &&, ??)
       * which either always short-circuit or never short-circuit are both likely indications of
       * programmer error.
       *
       * @see https://eslint.org/docs/latest/rules/no-constant-binary-expression
       */
      'no-constant-binary-expression': 'error',

      /**
       * Nesting ternary expressions can make code more difficult to understand.
       *
       * @see https://eslint.org/docs/latest/rules/no-nested-ternary
       */
      'no-nested-ternary': 'error',

      /**
       * Disallows async functions which have no await expression.
       *
       * @see https://eslint.org/docs/latest/rules/require-await
       */
      'require-await': 'error',

      /**
       * There are many ways to import a index file. This rule prevent unnecessary
       * path segments in import and require statements
       */
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],

      /**
       * Enforce a convention in the order of named imports
       *
       * @see https://github.com/benmosher/eslint-plugin-import/issues/1732
       * @see https://eslint.org/docs/latest/rules/sort-imports
       */
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],

      /**
       * Enforce a convention in the order of require / import statements.
       */
      'import/order': [
        'error',
        {
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: '*.{css,scss,sass}',
              group: 'unknown',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          warnOnUnassignedImports: true,
        },
      ],
    },
  },
  {
    ignores: ['.next/', 'next-env.d.ts'],
  },
);
