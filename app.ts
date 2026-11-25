import http from 'node:http';

export function createApp(): http.Server {
	return http.createServer((req, res) => {
		if (req.method === 'GET' && req.url === '/ping') {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ data: 'pong v3' }));
			return;
		}

		res.writeHead(404, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ error: 'Not Found' }));
	});
}
