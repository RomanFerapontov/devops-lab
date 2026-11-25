import { createApp } from './app.ts';

const PORT = Number(process.env.PORT) || 8001;

createApp().listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
