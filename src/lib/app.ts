import { t } from "elysia";
import elysia from "$lib/elysia/setup";

export const app = elysia.post("/login", ({ body }) => body, {
  body: t.Object({
    username: t.String(),
    password: t.String({
      minLength: 8,
      description: "User password (at least 8 characters)",
    }),
  }),
  response: t.Object({
    username: t.String(),
    password: t.String(),
  }),
});

export type App = typeof app;
