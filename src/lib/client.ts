import { treaty } from "@elysiajs/eden";
import type { App } from "$lib/app";

// Create client
const endpoint = import.meta.env.DEV ? `localhost:5173` : `svelterust.fly.dev`;
export default treaty<App>(endpoint).api;
