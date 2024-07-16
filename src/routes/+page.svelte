<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	let lists = data.lists;

	function submit() {
		let query = new URLSearchParams();
		lists
			.filter((list) => !!list)
			.forEach((list) => {
				query.append('list', list.user + ',,,' + list.list);
			});
		let queryParams = query.toString();
		replaceState(`/?${queryParams}`, {}); // TODO: Fix that (create gh issue)
		goto(`/results?${queryParams}`);
	}
</script>

<div class="container">
	<h1>Party members</h1>

	<ul>
		{#each lists as list, list_idx}
			<li>
				<input type="text" bind:value={list.user} placeholder="username" />
				<input type="text" bind:value={list.list} placeholder="list name" />

				<button
					on:click={() => (lists = lists.filter((_, idx) => idx !== list_idx))}
					disabled={lists.length <= 1}
				>
					Remove
				</button>
			</li>
		{/each}
	</ul>

	<div style="display: flex; gap: .5rem;">
		<button
			class="action-button"
			on:click={() => (lists = [...lists, { user: '', list: 'watchlist' }])}>Add list</button
		>
		<button class="action-button" on:click={() => submit()}>Lez go 🎬</button>
	</div>
</div>

<div class="container">
	<h3>Usage notes</h3>

	<p>Use the same users' and lists' names as the ones in the letterboxd urls.</p>
	<p>
		E.g. https://letterboxd.com/<span style="color: var(--red-bg)">crew</span>/list/<span
			style="color: var(--red-bg)">showdown-chopping-mall</span
		>/
	</p>
	<br />
	<p>Only the top 100 will be displayed</p>
	<br />
	<p>The party will fail if one of the lists is more than 100 pages long</p>
	<br />
	<p>
		Github repo:
		<a href="https://github.com/AlexisGado/pedantic-movie-nerds-party"
			>https://github.com/AlexisGado/pedantic-movie-nerds-party</a
		>
	</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		font-family: var(--font-family);
		font-weight: 600;

		padding: 1rem;
		margin-top: 2rem;

		background-color: var(--beige);
		border: 0.2rem solid #000;
	}

	li {
		list-style: none;
		margin-bottom: 0.5rem;
	}

	h1,
	h3 {
		margin-bottom: 1rem;
	}

	input[type='text'] {
		padding: 0.25rem;
		font-family: inherit;
		font-size: medium;

		border: 0.1rem solid black;
		border-radius: 0.25rem;
	}

	button {
		cursor: pointer;

		padding: 0.25rem;
		background-color: var(--beige);
		filter: brightness(80%);

		font-family: inherit;
		font-size: medium;

		border: 0.1rem solid black;
		border-radius: 0.25rem;
	}
	button:hover:enabled {
		filter: brightness(120%);
	}

	.action-button {
		line-height: 1.5rem;
		font-weight: 600;
	}
</style>
