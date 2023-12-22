export function load({ url }) {
	const urlParams = url.searchParams.getAll('list');
	const lists = urlParams.length ? urlParams : [''];
	// console.log(url.toString());
	return { lists };
}
