import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

export const app = new Elysia({ prefix: "/api" })
  .use(cors())
  .use(
    swagger({
      path: "/",
    }),
  )
  .post("/login", ({ body }) => body, {
    body: t.Object(
      {
        username: t.String(),
        password: t.String({
          minLength: 8,
          description: "User password (at least 8 characters)",
        }),
      },
      {
        description: "Expected an username and password",
      },
    ),
    response: t.Object({
      username: t.String(),
      password: t.String(),
    }),
  });

export type App = typeof app;
