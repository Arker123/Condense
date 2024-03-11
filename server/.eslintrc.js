module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["google", "plugin:prettier/recommended"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "max-len": ["error", 120],
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
            },
        ],
    },
    plugins: ["prettier"],
};
