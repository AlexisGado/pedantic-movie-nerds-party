interface List {
	user: string;
	list: string;
}
export function load({ url }) {
	try {
		const urlParams: List[] = url.searchParams.getAll('list').map((el) => {
			const els = el.split(',,,');
			return { user: els[0], list: els[1] };
		});
		if (urlParams.length === 0) throw new Error('No list found');
		return { lists: urlParams };
	} catch {
		return { lists: [{ user: '', list: 'watchlist' }] };
	}
}
