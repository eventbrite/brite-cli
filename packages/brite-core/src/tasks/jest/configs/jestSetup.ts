import 'jest-enzyme/lib';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';

configure({adapter: new Adapter()});

const CONSOLE_FAIL_TYPES = ['error', 'warn'];

const failOnConsole = (type, message) => {
    throw new Error(`Failing due to console.${type} while running test!\n\n${message}`);
};

CONSOLE_FAIL_TYPES.forEach((type) => {
    // eslint-disable-next-line no-console
    console[type] = failOnConsole.bind(null, type);
});
