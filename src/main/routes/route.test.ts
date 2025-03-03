import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";

let collection: Collection;

describe("Register Routes POST/registers", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    collection = await MongoHelper.getCollection("registers");
    await collection.deleteMany({});
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
    collection = await MongoHelper.getCollection("registers");
    await collection.deleteMany({});
  });

  test("Should return 200 on load registers", async () => {
    await collection.insertOne({
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

describe("signup Routes POST/signup", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    collection = await MongoHelper.getCollection("accounts");
    await collection.deleteMany({});
  });

  describe("signup route", () => {
    test("Should return an account on success", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "joabe",
          email: "any_email@email.com",
          password: "any_password",
          passwordConfirmation: "any_password",
        })
        .expect(200);
    });
  });
});

/* 
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
  }); */
/* 
   test("Should return 200 on load  one register", async () => {
    await regCollection.insertOne({
      _id: new ObjectId("679ab39d7d59d0bb5e243ec8"),
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
    await regCollection.findOne(new ObjectId("679ab39d7d59d0bb5e243ec8"));

    await request(app).get("/api/register/:id").expect(200);
  });  */
