<script>
	import { goto } from "$app/navigation";

    let lists = [""];

    function submit() {
        console.log(lists);
        let query = new URLSearchParams();
        lists.forEach((list) => query.append("list", list));
        goto(`/results?${query.toString()}`);
    }
</script>

<h1>Welcome to PMNP</h1>

<ul>
  {#each lists as list}
    <li>
        <input type="text" bind:value={list} />
          {#if lists.length > 1}
            <button on:click={() => lists = lists.filter(l => l !== list)}>Remove</button>
          {/if}
    </li>
  {/each}
</ul>

<button on:click={() => lists = [...lists, ""]}>Add</button>

<button on:click={submit}>Lez go</button>
