/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    verbose: true,
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.test.ts?$": [
            "ts-jest",
            {
                diagnostics: false,
            },
        ],
    },
};
