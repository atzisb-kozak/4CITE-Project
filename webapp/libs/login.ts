const endpointUrl = "http://localhost:3000/auth/login";

export async function fetchCardDetails(): Promise<any> {
	const url = new URL(endpointUrl);

	const ctrl = new AbortController();
	const id = setTimeout(() => ctrl.abort(), 5000);

	try {
		const res = await fetch(url.toString(), { signal: ctrl.signal, method: 'post' });
		if (!res.ok) {
			return;
		}

		clearTimeout(id);

		const json = await res.json();
		return json;
	} catch (err) {
		console.error(err);
		return;
	}
}
