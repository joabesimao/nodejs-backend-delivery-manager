import request from "supertest";
import app from "../config/app";

describe("Cors middleware", () => {
  test("Should enable cors", async () => {
    app.get("/test_cors", (req, res) => {
      res.send();
    });
    await request(app)
      .get("/test_cors")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*");
  });

  test("Should respond with 204 and end the request on OPTIONS method", async () => {
    app.post("/test_cors_options", (req, res) => {
      res.send();
    });
    await request(app)
      .options("/test_cors_options")
      .expect(204)
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*");
  });
});
