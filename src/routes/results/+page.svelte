<script lang="ts">
	export let data;
</script>

{#await data.streaming.result}
	<p>loading...</p>
{:then results}
	<ul>
		{#each results as { movie, count }}
			<li>
				{movie} : {count}
			</li>
		{/each}
	</ul>
{/await}
