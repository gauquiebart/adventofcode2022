
import {expect, test} from '@jest/globals';

const fc = require('./solution');

test('adds 1 + 2 to equal 3', () => {
    expect(fc(1, 2)).toBe(3);
});
