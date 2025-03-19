import request from "supertest";
import app from "../config/app";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { Collection } from "mongodb";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import env from "../../env";

let collection: Collection;
let accountCollection: Collection;

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
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Should return an register on success", async () => {
    await collection.insertOne({
      name: "joabe",
      email: "any_email@email.com",
      password: "any_password",
      accessToken: "any_token",
    });
    await request(app)
      .post(`/api/register/`)
      .set("x-access-token", "")
      .send({
        client: {
          name: "any_name",
          lastName: "any_last_name",
          phone: "any_phone",
        },
        address: {
          street: "any_street",
          neighborhood: "any_neighborhood",
          numberHouse: 123,
          reference: "any_reference",
          city: "any_city",
        },
      });
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
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  test("Should return 200 on load registers", async () => {
    const res = await accountCollection.insertOne({
      name: "joabe",
      email: "any_email@email.com",
      password: "any_password",

      role: "any_role",
    });
    const id = res.insertedId;
    const accessToken = sign({ id }, env.jwtSecret);
    await accountCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          accessToken: accessToken,
        },
      }
    );
    await request(app)
      .get("/api/register")
      .set("x-access-token", accessToken)
      .expect(200);
  });

  describe("Delete/Register/:id", () => {
    beforeAll(async () => {
      await MongoHelper.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
      //await MongoHelper.disconect();
    });

    beforeEach(async () => {
      collection = await MongoHelper.getCollection("registers");
      await collection.deleteMany();
    });

    test("Should return 200 on delete an Register", async () => {
      const registerForDelete = await collection.insertOne({
        id: "1",
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
          city: "any_city",
        },
        role: "admin",
      });
      await request(app)
        .delete(`/api/register/${registerForDelete.insertedId.toHexString()}`)

        .expect(200);
    });
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

  describe("login route", () => {
    test("Should return 200 on login", async () => {
      const password = await hash("123", 12);
      await collection.insertOne({
        name: "joabe",
        email: "any_email@email.com",
        password,
        accessToken: "any_token",
        role: "admin",
      });
      await request(app)
        .post("/api/login")
        .send({
          email: "any_email@email.com",
          password: "123",
          accessToken: "any_token",
          role: "admin",
        })
        .expect(200);
    });

    test("Should return 401 if invalid credentials", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "any_email@email.com",
          password: "123",
        })
        .expect(401);
    });
  });
});

describe("OrderDelivery Routes POST/orderDelivery", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    collection = await MongoHelper.getCollection("orderDeliverys");
    await collection.deleteMany({});

    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe("orderDelivery route", () => {
    test("Should return an order on success", async () => {
      const res = await accountCollection.insertOne({
        name: "joabe",
        email: "any_email@email.com",
        password: "any_password",

        role: "any_role",
      });
      const id = res.insertedId;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            accessToken: accessToken,
          },
        }
      );
      await request(app)
        .post("/api/orderDelivery")
        .set("x-access-token", accessToken)
        .send({
          register: {
            id: 1,
            client: {
              name: "any_name",
              lastName: "any_last_name",
              phone: "any_phone",
            },
            address: {
              street: "any_street",
              neighborhood: "any_neighborhood",
              numberHouse: 123,
              reference: "any_reference",
              city: "any_city",
            },
          },
          amount: 1,
          data: new Date("2022-10-10"),
          quantity: "12",
        })
        .expect(200);
    });
  });
});
