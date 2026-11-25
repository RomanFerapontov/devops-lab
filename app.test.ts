import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createApp } from './app.ts';

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
