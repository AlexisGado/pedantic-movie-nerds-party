import { error } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

interface Movie {
	name: string;
	path: string;
}

async function fetch_page(url: string) {
	let content;
	try {
		content = await (await fetch(url)).text();
	} catch {
		return error(500, { message: `Couldn't fetch from ${url}` });
	}
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
	let content;
	try {
		content = await (await fetch(url)).text();
	} catch {
		return error(500, { message: `Couldn't fetch from ${url}` });
	}
	const $ = cheerio.load(content);
	const nb_pages = parseInt($('div.pagination ul').children('li').last().text());
	if (!nb_pages) {
		const res = await fetch_page(url);
		if (!res.length) return error(500, { message: `No movie found at ${url}` });
		return res;
	}
	if (nb_pages > 100) return error(500, { message: `Too many pages in this list: ${url}` });
	const all_pages = await Promise.all(
		Array.from({ length: nb_pages }, (_, i) => fetch_page(`${url}/page/${i + 1}/`))
	);
	return all_pages.flat();
}

async function aggregate_movies(promises: Promise<{ listName: string; movies: Movie[] }>[]) {
	const listNamesAndMovies = await Promise.all(promises);

	const movies_with_count: Record<string, { count: number; name: string; hits: string[] }> = {};

	for (const { listName, movies } of listNamesAndMovies) {
		for (const movie of movies) {
			if (!movies_with_count[movie.path]) {
				movies_with_count[movie.path] = { count: 1, name: movie.name, hits: [listName] };
			} else {
				movies_with_count[movie.path].count++;
				movies_with_count[movie.path].hits.push(listName);
			}
		}
	}

	const result = Object.entries(movies_with_count)
		// start shuffling
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
		// end shuffling
		.sort((a, b) => b[1].count - a[1].count)
		.map(([path, { count, name, hits }]) => ({ path, count, name, hits }))
		.slice(0, 100);
	return result;
}

export async function load({ url }) {
	const lists = url.searchParams.getAll('list');
	const promises = lists.map((el) => {
		const [user, list] = el.split(',,,');
		const url =
			list === 'watchlist'
				? `https://letterboxd.com/${user}/watchlist/`
				: `https://letterboxd.com/${user}/list/${list}/`;
		return [user, list, fetch_all_movies(url)] as const;
	});

	return {
		streaming: {
			result: aggregate_movies(
				promises.map(async ([u, l, p]) => {
					return { listName: l === 'watchlist' ? u : l, movies: await p };
				})
			),
			lists: promises.map(
				([u, l, p]) =>
					[
						u,
						l,
						new Promise<void>((resolve, reject) => p.then(() => resolve()).catch(reject))
					] as const
			)
		}
	};
}
