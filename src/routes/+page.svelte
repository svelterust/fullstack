<script lang="ts">
  import client from "$lib/client";

  // Login
  async function login() {
    const { data } = await client.login.post({
      username: "hunter007",
      password: "whatsup123",
    });
    console.log(data);
  }
</script>

<div class="flex items-center gap-4">
  <h1 class="text-3xl font-semibold">Business</h1>
  <button class="btn" onclick={login}>Login</button>
</div>
