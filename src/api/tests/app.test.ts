import { test, expect /*, describe, it */ } from "vitest";
import request from "supertest";
import app from "../../App";



if (process.env.NODE_ENV === "test") {
  app.get("/big", (_req, res) => res.json({ data: "x".repeat(20_000) }));
}

test("helmet headers", async () => {
  const res = await request(app).get("/");
  expect(res.headers["x-content-type-options"]).toBe("nosniff");
  expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
});

test("cors allows 5173", async () => {
  const res = await request(app)
    .get("/ext/external-info")
    .set("Origin", "http://localhost:5173");
  expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
});

test("compression works", async () => {
  const res = await request(app)
    .get("/big")
    .set("Accept-Encoding", "gzip");
  expect(res.headers["content-encoding"]).toBe("gzip");
});

