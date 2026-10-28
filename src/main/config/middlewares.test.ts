import request from "supertest";
import app from "./app";

describe("Middlewares config", () => {
  test("Should apply cors, body parser and content type middlewares", async () => {
    app.post("/test_middlewares", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post("/test_middlewares")
      .send({ name: "Joabe" })
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "Content-Type, x-access-token, Authorization")
      .expect("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
      .expect("x-content-type-options", "nosniff")
      .expect("content-type", /json/)
      .expect({ name: "Joabe" });
  });

  test("Should not expose the x-powered-by header", async () => {
    app.get("/test_powered_by", (req, res) => {
      res.send();
    });
    const response = await request(app).get("/test_powered_by");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});
