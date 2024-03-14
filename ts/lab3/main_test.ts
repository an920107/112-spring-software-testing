import test, { describe, it } from 'node:test';
import assert from 'assert';
import { Calculator } from './main';

test("Calculator's exp", () => {
    const calc = new Calculator();
    assert.throws(() => calc.exp(Number.POSITIVE_INFINITY), {
        name: "Error",
        message: "unsupported operand type",
    });
    assert.throws(() => calc.exp(Number.MAX_SAFE_INTEGER), {
        name: "Error",
        message: "overflow",
    });
    assert.strictEqual(calc.exp(5), Math.exp(5));
});

test("Calculator's log", () => {
    const calc = new Calculator();
    assert.throws(() => calc.log(Number.POSITIVE_INFINITY), {
        name: "Error",
        message: "unsupported operand type",
    });
    assert.throws(() => calc.log(0), {
        name: "Error",
        message: "math domain error (1)",
    });
    assert.throws(() => calc.log(-1), {
        name: "Error",
        message: "math domain error (2)",
    });
    assert.strictEqual(calc.log(5), Math.log(5));
});