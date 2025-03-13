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
        city: "any_city",
      },
    });
    expect(register).toBeTruthy();
    expect(register.id).toBeTruthy();
    expect(register.client).toBeTruthy();
    expect(register.address).toBeTruthy();
    expect(register.address.numberHouse).toBe(123);
    expect(register.client.name).toBe("any_name");
    expect(register.address.street).toBe("any_street");
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
    const sut = makeSut();
    await sut.add({
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
    await sut.add({
      client: {
        name: "other_name",
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
    const registers = await sut.loadAll();
    expect(registers.length).toBe(3);
    expect(registers[0].client.name).toBe("any_name");
    expect(registers[1].client.name).toBe("other_name");
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
    const result = await regCollection.findOne({
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
    const sut = makeSut();
    const register = await sut.loadById(1);
    expect(register).toEqual(result);
  });

  test("Should delete one Register on success", async () => {
    await regCollection.deleteOne({
      id: 1,
    });

    const sut = makeSut();
    const register = await sut.deleteById(1);
    expect(register).toEqual("Deletado com sucesso!");
  });

  test("Should update one Register on success", async () => {
    const sut = makeSut();
    await regCollection.updateOne(
      { _id: new ObjectId(2) },
      {
        $set: {
          _id: 1,
          client: {
            name: "any_name",
            lastName: "any_last_name",
            phone: "number",
          },
          address: {
            street: "any_stree",
            neighborhood: "any_neighborhood",
            numberHouse: 1,
            reference: "any_reference",
            city: "any_city",
          },
        },
      }
    );

    const register = await sut.updateOneRegisterById(1, {
      client: {
        name: "any_name",
        lastName: "any_last_name",
        phone: "number",
      },
      address: {
        street: "any_street",
        neighborhood: "any_neighborhood",
        numberHouse: 1,
        reference: "any_reference",
        city: "any_city",
      },
    });
    expect(register).toEqual({});
  });
});
