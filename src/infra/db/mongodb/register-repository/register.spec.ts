import { Collection, ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { RegisterMongoRepository } from "./register";

const makeSut = (): RegisterMongoRepository => {
  return new RegisterMongoRepository();
};

let regCollection: Collection;

describe("Register Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    regCollection = await MongoHelper.getCollection("registers");
    await regCollection.deleteMany();
  });

  test("Should return an Register on success", async () => {
    const sut = makeSut();
    const register = await sut.add({
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
      },
      quantity: "any_quantity",
      amount: 1,
    });
    expect(register).toBeTruthy();
    expect(register.id).toBeTruthy();
    expect(register.client).toBeTruthy();
    expect(register.address).toBeTruthy();
    expect(register.address.numberHouse).toBe(123);
    expect(register.client.name).toBe("any_name");
    expect(register.address.street).toBe("any_street");
    expect(register.amount).toBe(1);
  });
});

describe("LoadAll()", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    regCollection = await MongoHelper.getCollection("registers");
    await regCollection.deleteMany();
  });

  test("Should load all Register on success", async () => {
    await regCollection.insertMany([
      {
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
      },
      {
        id: 2,
        client: {
          id: 3,
          name: "other_name",
          lastName: "other_last_name",
          phone: "other_number",
        },
        address: {
          street: "other_street",
          neighborhood: "other_neighborhood",
          numberHouse: 1,
          reference: "other_reference",
        },
        amount: 2,
        quantity: "other_quantity",
      },
    ]);
    const sut = makeSut();
    const registers = await sut.loadAll();
    expect(registers.length).toBe(2);
    expect(registers[0].client.name).toBe("any_name");
    expect(registers[1].client.name).toBe("other_name");
  });

  test("Should load empty list", async () => {
    const sut = makeSut();
    const registers = await sut.loadAll();
    expect(registers.length).toBe(0);
  });
});

describe("LoadById()", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    regCollection = await MongoHelper.getCollection("registers");
    await regCollection.deleteMany();
  });

  test("Should load one Register on success", async () => {
    await regCollection.insertOne({
      client: {
        id: 1,
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
    const sut = makeSut();
    const register = await sut.loadById(1);
    expect(register).toEqual({
      id: 1,
      client: {
        id: 1,
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
  });
});
