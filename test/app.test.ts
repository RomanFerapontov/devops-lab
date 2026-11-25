import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createApp } from '../app.ts';

const server = createApp();
let baseUrl: string;

before(async () => {
	await new Promise<void>((resolve) => server.listen(0, resolve));
	const { port } = server.address() as AddressInfo;
	baseUrl = `http://localhost:${port}`;
});

after(() => {
	server.close();
});

test('GET /ping returns 200 and pong', async () => {
	const res = await fetch(`${baseUrl}/ping`);

	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { data: 'pong v3' });
});

test('GET /unknown returns 404 and Not Found', async () => {
  const res = await fetch(`${baseUrl}/unknown`);

  assert.equal(res.status, 404);
  assert.deepEqual(await res.json(), {error: 'Not Found'})
})

test('POST /multiply returns 200 and product', async () => {
	const res = await fetch(`${baseUrl}/multiply`, {
		method: 'POST',
		body: JSON.stringify({ a: 6, b: 7 }),
	});

	assert.equal(res.status, 200);
	assert.deepEqual(await res.json(), { data: 42 });
});

test('POST /multiply returns 400 on invalid body', async () => {
	const res = await fetch(`${baseUrl}/multiply`, {
		method: 'POST',
		body: JSON.stringify({ a: 'six', b: 7 }),
	});

	assert.equal(res.status, 400);
	assert.deepEqual(await res.json(), { error: 'Validation Error' });
});

test('POST /multiply returns 413 when body is too large', async () => {
	const res = await fetch(`${baseUrl}/multiply`, {
		method: 'POST',
		body: 'x'.repeat(1024 * 1024 + 1),
	});

	assert.equal(res.status, 413);
});
