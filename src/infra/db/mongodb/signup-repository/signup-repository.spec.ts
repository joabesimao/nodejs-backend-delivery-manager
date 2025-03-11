import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AddAccountMongoRepository } from "./signup-repository";

const makeSut = (): AddAccountMongoRepository => {
  const sut = new AddAccountMongoRepository();
  return sut;
};

let accountCollection: Collection;

describe("AddAccount Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany();
  });

  test("Should return an Account  on success", async () => {
    const sut = makeSut();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBeTruthy();
    expect(account.email).toBeTruthy();
    expect(account.password).toBeTruthy();
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
    expect(account.name).toBe("any_name");
  });
});
