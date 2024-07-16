<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	export let data: PageData;

	const filmUrl = 'https://letterboxd.com/film';

	const random4digit = () => {
		const nb = Math.floor(Math.random() * 10000);
		return String(nb).padStart(4, '0');
	};
</script>

<a href={`/${$page.url.search}`} class="back-button">{'<= Back to search'}</a>
<div class="progress-info">
	<ul>
		{#each data.streaming.lists as list}
			<li>
				{#await list[2]}
					{' ⏳'}
				{:then}
					{' ✅'}
				{:catch}
					{' ❌'}
				{/await}
				- Fetching movies from {list[0]}'s {list[1]}
			</li>
		{/each}
	</ul>
</div>

{#await data.streaming.result then results}
	<ul class="movies-list">
		{#each results as { path, name, count }}
			{@const randomNb = random4digit()}
			<li>
				<div class="movie-list-item">
					<div class="movie-item-border">
						<a
							href={`${filmUrl}${path}`}
							class="movie-item"
							target="_blank"
							rel="noopener noreferrer"
						>
							<div class="vertical-number-left">{randomNb}</div>
							<div class="separator" />
							<div class="center">
								<span class="movie-title">
									{name}
								</span>
								<span><span style="font-size: large; font-weight: 600;">{count}</span> hits</span>
							</div>
							<div class="separator" />
							<div class="vertical-number-right">{randomNb}</div>
						</a>
					</div>
				</div>
			</li>
		{/each}
	</ul>
{:catch e}
	<div class="error-message">{e.message}</div>
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
	li {
		list-style: none;
	}
	.back-button {
		background: var(--beige);
		font-family: var(--font-family);
		padding: 0.5rem;
		margin: 1rem;
		border: 0.2rem solid #000;
		display: inline-block;
		font-weight: 600;
	}
	.back-button:hover {
		transform: scale(1.05);
	}

	.progress-info {
		font-family: var(--font-family);
		padding: 0.5rem;
		margin: 0.5rem;

		background: var(--beige);
		border: 0.2rem solid #000;
	}

	.movies-list {
		list-style-type: none;
		padding: 0;
		margin: 0;
		margin-top: 1rem;
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
		background-color: var(--beige);
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		font-family: var(--font-family);
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
	.error-message {
		font-family: var(--font-family);
		font-weight: 600;
		color: var(--red-bg);

		padding: 0.5rem;
		margin: 0.5rem;

		background: var(--beige);
		border: 0.2rem solid #000;
	}
</style>
