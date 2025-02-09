import { app } from "$lib/app";

// Handle API requests with Elysia
const handler = ({ request }: { request: Request }) => app.handle(request);
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
