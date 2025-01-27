import { MongoHelper } from "../helpers/mongo-helper";
import { RegisterMongoRepository } from "./register";

describe("Register Mongo Repository", () => {
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

  const makeSut = (): RegisterMongoRepository => {
    return new RegisterMongoRepository();
  };

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
