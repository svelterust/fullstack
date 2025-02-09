<script lang="ts">
    import client from "$lib/client";

    // Messages
    let messages = $state([]);
    async function getMessages() {
        messages = [];
        const { data } = await client.messages.get();
        for await (const { index } of data) {
            messages.push(index);
        }
    }
</script>

<h1>Business</h1>
<button onclick={getMessages}>Get messages</button>

{#if messages.length > 0}
    <ul>
        {#each messages as message}
            <li>{message}</li>
        {/each}
    </ul>
{/if}
