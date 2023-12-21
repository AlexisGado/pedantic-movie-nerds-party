import * as cheerio from 'cheerio';

interface Movie {
	name: string;
	path: string;
}

async function fetch_page(url: string) {
	const content = await (await fetch(url)).text();
	const $ = cheerio.load(content);
	const movies: Movie[] = [];
	$('li.poster-container>div.poster').each(function () {
		const path = $(this).attr('data-film-slug');
		const name = $(this).find('img').attr('alt');
		if (!name || !path) throw new Error('No movie name found');
		movies.push({ name, path: `/${path}` });
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

async function aggregate_movies(promises: Promise<Movie[]>[]) {
	const movies = await Promise.all(promises);
	const movies_with_count: Record<string, { count: number; name: string }> = movies
		.flat()
		.reduce<Record<string, { count: number; name: string }>>((acc, movie) => {
			if (!acc[movie.path]) {
				acc[movie.path] = { count: 1, name: movie.name };
			} else {
				acc[movie.path].count++;
			}
			return acc;
		}, {});

	const result = Object.entries(movies_with_count)
		.sort((a, b) => b[1].count - a[1].count)
		.map(([path, { count, name }]) => ({ path, count, name }))
		.slice(0, 200);
	return result;
}

export async function load({ url }) {
	const lists = url.searchParams.getAll('list');
	const promises = lists.map(
		(list) => [list, fetch_all_movies(`https://letterboxd.com/${list}/watchlist/`)] as const
	);

	return {
		streaming: {
			result: aggregate_movies(promises.map(([, p]) => p)),
			lists: promises.map(
				([l, p]) => [l, new Promise<void>((resolve) => p.then(() => resolve()))] as const
			)
		}
	};
}
