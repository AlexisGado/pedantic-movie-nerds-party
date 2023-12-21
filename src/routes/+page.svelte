<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let urlParams = $page.url.searchParams.getAll('list');
	let lists = urlParams.length ? urlParams : [''];

	function getQueryParams(lists: string[]) {
		let query = new URLSearchParams();
		lists.filter((list) => !!list).forEach((list) => query.append('list', list));
		let strQuery = query.toString();
		if (browser) goto(`?${strQuery}`, { keepFocus: true });
		return strQuery;
	}
	$: queryParams = getQueryParams(lists);
	$: resultUrl = `/results?${queryParams}`;
</script>

<h1>Welcome to PMNP</h1>

<ul>
	{#each lists as list, list_idx}
		<li>
			<input type="text" bind:value={list} />
			{#if lists.length > 1}
				<button on:click={() => (lists = lists.filter((_, idx) => idx !== list_idx))}>
					Remove
				</button>
			{/if}
		</li>
	{/each}
</ul>

<button on:click={() => (lists = [...lists, ''])}>Add</button>

<a href={resultUrl}>Lez go</a>
