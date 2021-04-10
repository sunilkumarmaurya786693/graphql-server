
module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jest": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "extends": "airbnb",
    'rules': {
        // 'no-async-promise-executor': 'off',
        // 'no-unused-vars': 'off',
        // 'node/no-unsupported-features/es-syntax': 'off',
        "indent": ["error", 4],
        // "no-undef":'off',
        // "require-atomic-updates":'off',
        "camelcase": [0],
        "max-len": [1, 150, 4],
        "no-console": "off"
    }
}
