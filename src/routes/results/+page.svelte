<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	export let data: PageData;

	const filmUrl = 'https://letterboxd.com/film';
</script>

<a href={`/${$page.url.search}`} class="back-button">{'<= Back to search'}</a>
{#await data.streaming.result}
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
{/await}
{#await data.streaming.result}
	<p>Loading...</p>
{:then results}
	<ul class="movies-list">
		{#each results as { path, name, count }}
			<li>
				<div class="movie-list-item">
					<div class="movie-item-border">
						<a
							href={`${filmUrl}${path}`}
							class="movie-item"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div class="vertical-number-left">1234</div>
							<div class="separator" />
							<div class="center">
								<span class="movie-title">
									{name}
								</span>
								<span>{count}</span>
							</div>
							<div class="separator" />
							<div class="vertical-number-right">1234</div>
						</a>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{:catch}
	<p>Something went wrong</p>
{/await}

<style>
	:root {
		--corner-radius: 20px;
	}
	a {
		color: unset;
		text-decoration: unset;
	}
	.back-button {
		background: #c8b29a;
		font-family: 'Courier New', Courier, monospace;
		padding: 0.5rem;
		border: 0.2rem solid #000;
		display: inline-block;
		font-weight: 600;
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
		height: 120px;
		background-color: #c8b29a;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		font-family: 'Courier New', Courier, monospace;
		text-align: center;
		clip-path: path(
			'M 23 3 L 377 3 A 20 20 0 0 0 397 23 L 397 97 A 20 20 0 0 0 377 117 L 23 117 A 20 20 0 0 0 3 97 L 3 23 A 20 20 0 0 0 23 3'
		);
	}
	.movie-item-border {
		background-color: #000;
		clip-path: path(
			'M 20 0 L 380 0 A 20 20 0 0 0 400 20 L 400 100 A 20 20 0 0 0 380 120 L 20 120 A 20 20 0 0 0 0 100 L 0 20 A 20 20 0 0 0 20 0'
		);
	}
	.movie-item-border:hover {
		transform: scale(1.05);
	}
	.vertical-number-left {
		transform: rotate(-90deg);
	}
	.vertical-number-right {
		transform: rotate(90deg);
	}
	.separator {
		width: 0.2rem;
		height: 50%;
		background-color: #000;
	}
	.center {
		height: 100%;
		width: 80%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}
	.movie-title {
		font-weight: 900;
		text-transform: uppercase;
	}
</style>
