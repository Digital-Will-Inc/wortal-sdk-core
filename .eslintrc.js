module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        // We use a lot of any in this project for platform SDK return values. There's just too many to map out and
        // some of them are not documented.
        "@typescript-eslint/no-explicit-any": "off",
        // Base and empty (unsupported API) implementations often have unused parameters.
        "@typescript-eslint/no-unused-vars": "off",
    }
}
