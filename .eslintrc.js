module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "console": true,
        "process": true,
        "__filename": true,
        "__dirname": true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "rules": {
    }
};