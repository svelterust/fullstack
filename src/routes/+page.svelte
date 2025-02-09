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
  <h1 class="text-3xl font-semibold">Fullstack</h1>
  <button class="btn btn-primary" onclick={login}>Login</button>
  <span class="i-lucide-user"></span>
</div>
