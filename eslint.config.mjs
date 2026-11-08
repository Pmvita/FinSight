import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  {
    rules: {
      "prettier/prettier": "error",
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
  },
];
