import { treaty } from "@elysiajs/eden";
import type { App } from "$lib/app";

export default treaty<App>(import.meta.env.DEV ? `localhost:5173` : `svelterust.fly.dev`).api;
