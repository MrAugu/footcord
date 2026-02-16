module.exports = [
  {
    files: ["**/*.js"],          // target all JS files
    ignores: ["node_modules/**", "package-lock.json", "dist/**"],

    // parser and environment options
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        // Node.js globals
        process: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly",
      }
    },

    rules: {
      semi: ["error", "always"],        // require semicolons
      quotes: ["error", "double"],      // double quotes
      "no-unused-vars": ["warn"],       // warn on unused vars
      indent: ["error", "tab"],         // 1 tab indentation
    },
  },
];