<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	export let data: PageData;

	const filmUrl = 'https://letterboxd.com/film';
</script>

<a href={`/${$page.url.search}`}>Back to search</a>
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

						<div class="corner top left" />
						<div class="corner top right" />
						<div class="corner bottom left" />
						<div class="corner bottom right" />
					</a>
				</div>
			</li>
		{/each}
	</ul>
{:catch}
	<p>Something went wrong</p>
{/await}

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
		height: 120px;
		background-color: #c8b29a;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		font-family: 'Courier New', Courier, monospace;
		text-align: center;
		position: relative;
		overflow: hidden;
	}
	.movie-item:hover {
		transform: scale(1.05);
	}
	.vertical-number-left {
		transform: rotate(-90deg);
	}
	.vertical-number-right {
		transform: rotate(90deg);
	}
	.separator {
		width: 2px;
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
	.corner {
		position: absolute;
		width: 40px;
		height: 40px;
		border-radius: 100%;
		background-color: #fff;
	}
	.top {
		top: -20px;
	}
	.bottom {
		bottom: -20px;
	}
	.left {
		left: -20px;
	}
	.right {
		right: -20px;
	}

	.movie-title {
		font-weight: bold;
		text-transform: uppercase;
	}
</style>
