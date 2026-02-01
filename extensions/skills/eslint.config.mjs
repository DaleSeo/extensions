import js from "@eslint/js";
import typescript from "typescript-eslint";
import raycast from "@raycast/eslint-plugin";
import prettier from "eslint-config-prettier/flat";
import globals from "globals";

export default typescript.config(
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
    },
  },
  raycast.configs.recommended,
  prettier,
);
