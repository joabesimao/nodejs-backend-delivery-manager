import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

let regCollection: Collection;

describe("Register Routes POST/registers", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    regCollection = await MongoHelper.getCollection("registers");
    await regCollection.deleteMany({});
  });

  test("Should return an register on success", async () => {
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

describe("GET /Register", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    regCollection = await MongoHelper.getCollection("registers");
    await regCollection.deleteMany({});
  });

  test("Should return 200 on load registers", async () => {
    await regCollection.insertOne({
      id: 1,
      client: {
        id: 2,
        name: "any_name",
        lastName: "any_last_name",
        phone: "any_number",
      },
      address: {
        street: "any_street",
        neighborhood: "any_neighborhood",
        numberHouse: 1,
        reference: "any_reference",
      },
      amount: 2,
      quantity: "any_quantity",
    });
    await request(app).get("/api/register").expect(200);
  });
});

describe("GET /Register/:id", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    regCollection = await MongoHelper.getCollection("registers");
    await regCollection.deleteMany({});
  });

  test("Should return 200 on load  one register", async () => {
    await regCollection.insertOne({
      id: 1,
      client: {
        id: 2,
        name: "any_name",
        lastName: "any_last_name",
        phone: "any_number",
      },
      address: {
        street: "any_street",
        neighborhood: "any_neighborhood",
        numberHouse: 1,
        reference: "any_reference",
      },
      amount: 2,
      quantity: "any_quantity",
    });
    await request(app).get("/api/register/:id").expect(200);
  });
});
