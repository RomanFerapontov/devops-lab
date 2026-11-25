export interface IMultiplyRequest {
	a: number;
	b: number;
}

export interface IMultiplyResponse {
	data: number;
}

export function multiply(a: number, b: number): number {
	return a * b;
}

export function parseMultiplyBody(raw: string): IMultiplyRequest | null {
	let data: unknown;
	try {
		data = JSON.parse(raw);
	} catch {
		return null;
	}

	if (typeof data !== 'object' || data === null) return null;

	const { a, b } = data as Record<string, unknown>;
	if (typeof a !== 'number' || typeof b !== 'number') return null;

	return { a, b };
}
