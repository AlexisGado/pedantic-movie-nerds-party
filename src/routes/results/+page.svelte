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

<svg style="width: 0; height: 0;">
	<defs>
		<clipPath id="clip-ticket" clipPathUnits="objectBoundingBox">
			<path
				d="M 0.06 0.04
				L 0.94 0.04
				A 0.06 0.24 0 0 0 0.99 0.24
				L 0.99 0.76
				A 0.06 0.24 0 0 0 0.94 0.96
				L 0.06 0.96
				A 0.06 0.24 0 0 0 0.01 0.76
				L 0.01 0.24
				A 0.06 0.24 0 0 0 0.06 0.04
				Z"
			/>
		</clipPath>
		<clipPath id="clip-ticket-border" clipPathUnits="objectBoundingBox">
			<path
				d="M 0.05 0
				L 0.95 0
				A 0.05 0.20 0 0 0 1 0.20
				L 1 0.80
				A 0.05 0.20 0 0 0 0.95 1
				L 0.05 1
				A 0.05 0.20 0 0 0 0 0.80
				L 0 0.20
				A 0.05 0.20 0 0 0 0.05 0
				Z"
			/>
		</clipPath>
	</defs>
</svg>

<style>
	:root {
		--item-width: 450;
		--corner-radius: 20px;
		--item-height: calc(var(--item-width) / 4);
	}
	@media (max-width: 600px) {
		:root {
			--item-width: 300;
		}
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
		width: calc(var(--item-width) * 1px);
		height: calc(var(--item-height) * 1px);
		background-color: #c8b29a;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		font-family: 'Courier New', Courier, monospace;
		text-align: center;
		clip-path: url(#clip-ticket);
	}
	.movie-item-border {
		background-color: #000;
		clip-path: url(#clip-ticket-border);
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
