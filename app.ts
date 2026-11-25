import http from 'node:http';
import { multiply, parseMultiplyBody } from './multiply.ts';
import type { IMultiplyResponse } from './multiply.ts';

interface IPingResponse {
	data: string;
}

interface IErrorResponse {
	error: string;
}

type ResponseBody = IPingResponse | IMultiplyResponse | IErrorResponse;

const MAX_BODY_BYTES = 1024 * 1024; // 1 MB

function sendJson(res: http.ServerResponse, status: number, body: ResponseBody): void {
	res.writeHead(status, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(body));
}

function handleMultiply(req: http.IncomingMessage, res: http.ServerResponse): void {
	const chunks: Buffer[] = [];
	let size = 0;
	let tooLarge = false;

	req.on('data', (chunk: Buffer) => {
		size += chunk.length;
		if (size > MAX_BODY_BYTES) {
			tooLarge = true;
			return;
		}
		chunks.push(chunk);
	});

	req.on('error', () => {
		if (!res.headersSent) sendJson(res, 500, { error: 'Server Error' });
	});

	req.on('end', () => {
		if (tooLarge) {
			sendJson(res, 413, { error: 'Payload Too Large' });
			return;
		}

		const body = parseMultiplyBody(Buffer.concat(chunks).toString('utf8'));
		if (!body) {
			sendJson(res, 400, { error: 'Validation Error' });
			return;
		}

		sendJson(res, 200, { data: multiply(body.a, body.b) });
	});
}

export function createApp(): http.Server {
	return http.createServer((req, res) => {
		if (req.method === 'GET' && req.url === '/ping') {
			sendJson(res, 200, { data: 'pong v3' });
			return;
		}

		if (req.method === 'POST' && req.url === '/multiply') {
			handleMultiply(req, res);
			return;
		}

		sendJson(res, 404, { error: 'Not Found' });
	});
}