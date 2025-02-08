<script lang="ts">
    import client from "$lib/client";

    async function login() {
        const { data } = await client.login.post({
            username: "Hey there",
            password: "arsarstarts",
        });
        console.log(data);
    }
</script>

<h1>Business</h1>
<p>Welcome to my business!</p>
<button onclick={login}>Login</button>
