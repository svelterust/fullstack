import type { Handle } from "@sveltejs/kit";
import { getUserAndSession } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
  // Extract user and session from cookies and Authorization header
  const { user, session } = await getUserAndSession(event.cookies, event.request.headers);
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};
