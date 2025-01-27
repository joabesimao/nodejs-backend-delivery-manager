import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("Register Routes", () => {
  test("Should return an register on success", async () => {
    beforeAll(async () => {
      await MongoHelper.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
      await MongoHelper.disconect();
    });

    beforeEach(async () => {
      const regCollection = MongoHelper.getCollection("registers");
      await regCollection.deleteMany();
    });
    await request(app)
      .post("/api/register")
      .send({
        client: {
          id: 1,
          name: "any_name",
          lastName: "any_last_name",
          phone: "any_phone",
        },
        address: {
          street: "any_street",
          neighborhood: "any_neighborhood",
          numberHouse: 123,
          reference: "any_reference",
        },
        quantity: "any_quantity",
        amount: 1,
      })
      .expect(200);
  });
});
