import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

export default new Elysia({ prefix: "/api" }).use(cors()).use(
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
