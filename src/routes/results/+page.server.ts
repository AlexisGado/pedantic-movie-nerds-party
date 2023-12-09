import * as cheerio from 'cheerio';

export async function load({ url }) {
    const lists = url.searchParams.getAll('list');
    const results: {[k: string]: number} = {};
    for (const list of lists) {
        const url = `https://letterboxd.com/${list}/watchlist/`;
        const content = await (await fetch(url)).text();
        const $ = cheerio.load(content);
        $('li.poster-container>div>img').each(function () {
            const movie = $(this).attr('alt');
            if (!movie) throw new Error('No movie name found');
            results[movie] = (results[movie] || 0) + 1;
        });
    };
    console.log(results);
    
}