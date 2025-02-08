import { treaty } from "@elysiajs/eden";
import type { App } from "$lib/app";

// Create client to API
const port = import.meta.env.DEV ? 5173 : 3000;
const client = treaty<App>(`localhost:${port}`);
export default client.api;
