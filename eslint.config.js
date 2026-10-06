export default [
  {
    ignores: ["dist/**", "coverage/**"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off"
    }
  }
];
