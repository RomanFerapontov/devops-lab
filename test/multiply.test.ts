import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multiply, parseMultiplyBody } from '../multiply.ts';

test('multiply returns product', () => {
	assert.equal(multiply(3, 4), 12);
	assert.equal(multiply(-2, 5), -10);
	assert.equal(multiply(0, 7), 0);
});

test('parseMultiplyBody accepts valid body', () => {
	assert.deepEqual(parseMultiplyBody('{"a":2,"b":3}'), { a: 2, b: 3 });
});

test('parseMultiplyBody accepts zero', () => {
	assert.deepEqual(parseMultiplyBody('{"a":0,"b":5}'), { a: 0, b: 5 });
});

test('parseMultiplyBody ignores extra fields', () => {
	assert.deepEqual(parseMultiplyBody('{"a":1,"b":2,"c":3}'), { a: 1, b: 2 });
});

const invalidBodies = [
	['invalid JSON', '{a:1'],
	['empty string', ''],
	['null', 'null'],
	['number', '42'],
	['missing b', '{"a":1}'],
	['string instead of number', '{"a":"2","b":3}'],
];

for (const [name, raw] of invalidBodies) {
	test(`parseMultiplyBody rejects ${name}`, () => {
		assert.equal(parseMultiplyBody(raw), null);
	});
}
