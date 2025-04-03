import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier"; // Import Prettier config
import eslint from "@eslint/js";

export default [
  // 1. Global ignores
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "*.log",
      ".env",
      "pnpm-lock.yaml",
      "yarn.lock",
      "package-lock.json",
      "eslint.config.mjs",
      ".prettierrc.js",
      "*.config.js",
      "*.config.ts",
      "**/generated/**",
    ],
  },

  // 2. Global language options and plugins
  {
    languageOptions: {
      globals: {
        ...globals.node, // Enables Node.js global variables
      },
    },
  },

  // 3. Base JavaScript rules recommended by ESLint
  pluginJs.configs.recommended,

  ...tseslint.config(
    tseslint.configs.recommended,
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...tseslint.configs.recommended,
    {
      languageOptions: {
        parserOptions: {
          project: "./tsconfig.json",
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        // Add specific overrides for TS rules if needed
        // e.g., "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for 'any'
        // Add any other project-specific TS rules here
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      },
    },
    {
      languageOptions: {
        globals: {
          ...globals.node, // Add Node.js global variables
        },
      },
    }
  ),
  eslintConfigPrettier,
];
