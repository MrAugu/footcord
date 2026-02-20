module.exports = [{
    files: ["**/*.js"], // target all JS files
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
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "no-unused-vars": ["warn"],
        indent: ["error", "tab"],
        "comma-dangle": ["error", "never"],
        "brace-style": ["error", "1tbs"],
        "eqeqeq": ["error", "always"],
        "max-len": ["warn", {
            "code": 200
        }],
        "no-console": "off",
        "no-nested-ternary": "warn",
        "prefer-template": "error",
        "object-shorthand": ["error", "always"],
        "no-undef": "error",
        "prefer-const": "error",
        "no-var": "error",
        "key-spacing": ["error", {
            "beforeColon": false,
            "afterColon": true
        }],
        "space-before-function-paren": ["error", "never"],
        "no-lonely-if": "warn",
        "no-else-return": "warn",
        "no-empty-function": "warn",
        "no-throw-literal": "error",
        "no-prototype-builtins": "error",
        "no-unsafe-negation": "error",
        "no-unneeded-ternary": "error",
        "prefer-template": "error",
        "object-shorthand": ["error", "always"],
        "prefer-destructuring": ["warn", {
            "object": true,
            "array": false
        }],
        "prefer-spread": "warn",
        "no-duplicate-imports": "error",
        "no-useless-rename": "error",
        "padding-line-between-statements": [
            "warn",
            {
                blankLine: "always",
                prev: "*",
                next: "return"
            }
        ],
        "newline-per-chained-call": ["warn", {
            "ignoreChainWithDepth": 2
        }],
        "func-style": ["warn", "declaration", {
            "allowArrowFunctions": true
        }],
        "no-trailing-spaces": ["error"]
    },
}, ];