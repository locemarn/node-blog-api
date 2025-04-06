import globals from "globals"
import pluginJs from "@eslint/js" // Provides eslint:recommended
import tseslint from "typescript-eslint" // The new unified TS ESLint package
import pluginImport from "eslint-plugin-import"
import pluginPrettier from "eslint-plugin-prettier" // Runs Prettier as an ESLint rule
import eslintConfigPrettier from "eslint-config-prettier" // Turns off conflicting ESLint rules

export default [
  // 1. Global ignores
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".eslintrc.js", // Ignore the old config file if it still exists
      "eslint.config.mjs",
      "jest.config.js",
      "coverage",
      "**/*.spec.ts",
      "**/*.test.ts",
      "jest.setup.ts",
      "jest.config.ts",
      // Add other specific files or directories to ignore
    ],
  },

  // 2. Base configuration for JavaScript files (eslint:recommended)
  pluginJs.configs.recommended,

  // 3. TypeScript configurations (parser, recommended rules)
  // This replaces 'plugin:@typescript-eslint/recommended' and sets the parser
  // Use 'configs.recommendedTypeChecked' if your project setup allows for type-aware linting
  // Use 'configs.recommended' for basic TS linting without type info
  ...tseslint.configs.recommendedTypeChecked, // Requires parserOptions.project
  // OR use this for faster linting without type-aware rules:
  // ...tseslint.configs.recommended,

  // 4. Language options applying to TS files (parser setup)
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "esnext",
        project: "./tsconfig.json", // Still needed for type-aware rules
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node, // Defines Node.js global variables and Node.js scoping.
        ...globals.es2022, // Defines ES2022+ globals.
        ...globals.jest, // Defines Jest globals.
      },
    },
    // If using recommendedTypeChecked, rules requiring type info work here.
    // If using just recommended, type-aware rules might error or be disabled.
  },

  // 5. Import plugin configuration
  {
    plugins: {
      import: pluginImport,
    },
    settings: {
      // This replaces 'plugin:import/recommended' and 'plugin:import/typescript' behavior
      "import/resolver": {
        typescript: {
          // Use the specific resolver package here
          // project: './tsconfig.json', // Usually inferred from parserOptions.project
          alwaysTryTypes: true, // Recommended setting
        },
        node: true, // Keep node resolver as fallback
      },
    },
    rules: {
      // Bring in rules from 'plugin:import/recommended' if not included by default
      // Many are often enabled by default or covered by TS checks, review as needed.
      // Example: 'import/no-unresolved': 'error', // Handled by resolver + TS usually
      "import/named": "error",
      "import/namespace": "error",
      "import/default": "error",
      "import/export": "error",

      // Your specific import rules
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always",
          jsx: "always",
          ts: "never",
          tsx: "never",
        },
      ],
      "import/no-unresolved": "error", // Keep this to ensure resolver works
      // Add other import rules if needed
      "@typescript-eslint/no-unsafe-assignment": "off",
      "import/no-absolute-path": "on",
    },
  },

  // 6. Prettier configuration (Plugin + Disabling Conflicting Rules)
  // First, configure the prettier rule itself
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Your original prettier rule setting:
      "prettier/prettier": "warn",
      // Add other rules that should run *before* prettier config disables them
    },
  },
  // THEN, apply eslint-config-prettier. This MUST be last.
  eslintConfigPrettier,

  // 7. Custom overrides / project-specific rules (Optional)
  // This is where you put rules that weren't part of the original "extends"
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Add any other custom rules here
    },
  },
]
