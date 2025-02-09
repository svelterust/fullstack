import { app } from "$lib/app";

// Use Elysia for API
const handler = ({ request }: { request: Request }) => app.handle(request);
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
