<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	export let data: PageData;

	const filmUrl = "https://letterboxd.com/film"
</script>

<a href={`/${$page.url.search}`}>Back to search</a>
	<ul>
		{#each data.streaming.lists as list}
			<li>
				Fetching movies from {list[0]}'s watchlist -
				{#await list[1]}
					{' ⏳'}
				{:then}
					{' ✅'}
				{:catch}
					{' ❌'}
				{/await}
			</li>
		{/each}
	</ul>
{#await data.streaming.result}
	<p>Loading...</p>
{:then results}
	<ul>
		{#each results as { path, name, count }}
			<li>
				<a href={`${filmUrl}${path}`}>{name}</a> : {count}
			</li>
		{/each}
	</ul>
{:catch}
	<p>Something went wrong</p>
{/await}
