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

<h1>Welcome to PMNP</h1>

<ul>
	{#each lists as list, list_idx}
		<li>
			<input type="text" bind:value={list.user} />
			<input type="text" bind:value={list.list} />
			{#if lists.length > 1}
				<button on:click={() => (lists = lists.filter((_, idx) => idx !== list_idx))}>
					Remove
				</button>
			{/if}
		</li>
	{/each}
</ul>

<button on:click={() => (lists = [...lists, { user: '', list: 'watchlist' }])}>Add</button>

<button on:click={() => submit()}>Lez go</button>
