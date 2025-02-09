import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

// Basic setup
const elysia = new Elysia({ prefix: "/api" }).use(cors()).use(
  swagger({
    path: "/",
    scalarConfig: {
      spec: {
        url: "/api/json",
      },
    },
    exclude: ["/api/", "/api/json"],
  }),
);

// Business logic
export const app = elysia.get("/messages", async function* () {
  let index = 1;
  while (index <= 10) {
    yield JSON.stringify({ index: index++ });
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
});

export type App = typeof app;
