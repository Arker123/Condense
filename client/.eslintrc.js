module.exports = {
    env: {
        browser: false,
        es2021: false,
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
    settings: {
        react: {
            version: "detect",
        },
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "prettier"],
    rules: {
        indent: ["error", 4],
        "no-unused-vars": "off",
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "max-len": ["error", 120],
        "react/prop-types": "off",
        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
            },
        ],
    },
};
