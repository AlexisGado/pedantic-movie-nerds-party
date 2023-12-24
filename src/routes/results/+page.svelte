<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	export let data: PageData;

	const filmUrl = "https://letterboxd.com/film"
</script>

<style>
	a {
		color: unset;
		text-decoration: unset;
	}
	.movies-list {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}
	.movie-list-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 1rem;
	}
	.movie-item {
		width: 400px;
		height: 150px;
		border: .2rem solid black;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		font-family: 'Courier New', Courier, monospace;
		text-align: center;
	}
	.movie-title {
		font-weight: bold;
		text-transform: uppercase;
	}
</style>

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
	<ul class="movies-list">
		{#each results as { path, name, count }}
			<li>
				<a href={`${filmUrl}${path}`} class="movie-list-item">
					<div class="movie-item">
						<span class="movie-title">
							{name}
						</span>
						<span>{count}</span>
					</div>
				</a>

			</li>
		{/each}
	</ul>
{:catch}
	<p>Something went wrong</p>
{/await}
