import * as cheerio from 'cheerio';

async function fetch_page(url: string) {
	const content = await (await fetch(url)).text();
	const $ = cheerio.load(content);
	const movies: string[] = [];
	$('li.poster-container>div>img').each(function () {
		const movie = $(this).attr('alt');
		if (!movie) throw new Error('No movie name found');
		movies.push(movie);
	});
	return movies;
}

async function fetch_all_movies(url: string) {
	const content = await (await fetch(url)).text();
	const $ = cheerio.load(content);
	const nb_pages = parseInt($('div.pagination ul').children('li').last().text());
	if (!nb_pages) return fetch_page(url);
	const all_pages = await Promise.all(
		Array.from({ length: nb_pages }, (_, i) => fetch_page(`${url}/page/${i + 1}/`))
	);
	return all_pages.flat();
}

async function aggregate_movies(promises: Promise<string[]>[]) {
	const movies = await Promise.all(promises);
	const movies_with_count: { [k: string]: number } = movies
		.flat()
		.reduce<{ [k: string]: number }>((acc, movie) => {
			acc[movie] = (acc[movie] || 0) + 1;
			return acc;
		}, {});

	const result = Object.entries(movies_with_count)
		.sort((a, b) => b[1] - a[1])
		.map(([movie, count]) => ({ movie, count }));
	return result;
}

export async function load({ url }) {
	const lists = url.searchParams.getAll('list');
	const promises = lists.map((list) =>
		fetch_all_movies(`https://letterboxd.com/${list}/watchlist/`)
	);

	return {
		streaming: {
			result: aggregate_movies(promises)
		}
	};
}
