// import type { Config } from 'jest';

// const config: Config = {
//   transform: {
//     '^.+\\.ts': 'ts-jest',
//   },
//   setupFiles: ['dotenv-override-true/config'],
//   testRegex: '.*\\.spec\\.ts$',
//   collectCoverage: true,
//   coverageDirectory: '.coverage',
// };

// export default config;

import type { Config } from "jest";

const config: Config = {
    transform: {
        "^.+\\.ts": "ts-jest",
    },
    setupFiles: ["dotenv-override-true/config", "<rootDir>/jest.setup.ts"],
    testRegex: ".*\\.spec\\.ts$",
    collectCoverage: true,
    coverageDirectory: ".coverage",
    testEnvironment: "jsdom",
};

export default config;
