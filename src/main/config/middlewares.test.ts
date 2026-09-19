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
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*")
      .expect("content-type", /json/)
      .expect({ name: "Joabe" });
  });
});
