import express from "express";
import request from "supertest";
import app from "../config/app";
import { errorHandler } from "./error-handler";

describe("Error handler middleware", () => {
  test("Should return 400 JSON (without stack trace) for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send('{"email": ');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "JSON inválido no corpo da requisição" });
    expect(response.text).not.toMatch(/at .*\.js/);
  });

  test("Should return 413 JSON when the body exceeds the limit", async () => {
    const response = await request(app)
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ data: "a".repeat(11 * 1024 * 1024) }));
    expect(response.status).toBe(413);
    expect(response.body).toEqual({
      error: "Corpo da requisição excede o tamanho máximo",
    });
  });

  test("Should return 404 JSON for unknown /api routes", async () => {
    const response = await request(app).get("/api/rota-que-nao-existe");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Rota não encontrada" });
  });

  test("Should return a generic 500 JSON for unexpected errors", async () => {
    jest.spyOn(console, "error").mockImplementationOnce(() => undefined);
    const sut = express();
    sut.get("/boom", () => {
      throw new Error("sensitive details");
    });
    sut.use(errorHandler);
    const response = await request(sut).get("/boom");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
    expect(response.text).not.toMatch(/sensitive details/);
  });
});
