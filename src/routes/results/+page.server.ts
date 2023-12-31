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
		if (!res.length) return error(500, { message: 'No movie found' });
		return res;
	}
	if (nb_pages > 100) return error(500, { message: 'Too many pages' });
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
	const promises = lists.map((el) => {
		const [user, list] = el.split(',,,');
		const url =
			list === 'watchlist'
				? `https://letterboxd.com/${user}/watchlist/`
				: `https://letterboxd.com/${user}/list/${list}/`;
		return [user, fetch_all_movies(url)] as const;
	});

	return {
		streaming: {
			result: aggregate_movies(promises.map(([, p]) => p)),
			lists: promises.map(
				([l, p]) =>
					[
						l,
						new Promise<void>((resolve, reject) => p.then(() => resolve()).catch(reject))
					] as const
			)
		}
	};
}
