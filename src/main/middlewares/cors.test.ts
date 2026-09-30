import express from "express";
import request from "supertest";
import app from "../config/app";
import { makeCors } from "./cors";

const ALLOWED_HEADERS = "Content-Type, x-access-token, Authorization";
const ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";

const makeAppWithOrigins = (origins: string[]) => {
  const sut = express();
  sut.use(makeCors(origins));
  sut.get("/test_cors", (req, res) => {
    res.send();
  });
  return sut;
};

describe("Cors middleware", () => {
  test("Should allow any origin when no origin list is configured", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });
    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", ALLOWED_HEADERS)
      .expect("access-control-allow-methods", ALLOWED_METHODS);
  });

  test("Should respond with 204 and end the request on OPTIONS method", async () => {
    app.post("/test_cors_options", (req, res) => {
      res.send();
    });
    await request(app)
      .options("/test_cors_options")
      .expect(204)
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", ALLOWED_HEADERS)
      .expect("access-control-allow-methods", ALLOWED_METHODS);
  });

  test("Should reflect the origin when it is in the allowed list", async () => {
    await request(makeAppWithOrigins(["https://app.com"]))
      .get("/test_cors")
      .set("Origin", "https://app.com")
      .expect("access-control-allow-origin", "https://app.com")
      .expect("vary", /Origin/);
  });

  test("Should not send allow-origin when the origin is not allowed", async () => {
    const response = await request(makeAppWithOrigins(["https://app.com"]))
      .get("/test_cors")
      .set("Origin", "https://evil.com");
    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
