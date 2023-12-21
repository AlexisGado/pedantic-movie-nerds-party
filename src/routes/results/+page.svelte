<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#await data.streaming.result}
	<p>Loading...</p>
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
{:then results}
	<ul>
		{#each results as { name, count }}
			<li>
				{name} : {count}
			</li>
		{/each}
	</ul>
{/await}
