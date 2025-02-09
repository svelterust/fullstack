<script lang="ts">
  import "../app.css";

  // Props
  const { children } = $props();
</script>

<div class="container mx-auto">
  {@render children()}
</div>
