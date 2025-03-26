import { Collection, ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "../account-repository/account-repository";

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository();
  return sut;
};

let accountCollection: Collection;

describe("Account Mongo Repository", () => {
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

  test("Should find and return an Account on LoadByEmail on success", async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
    const account = await sut.loadAccountByEmail("any_email@email.com");
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return null if loadByEmail fails", async () => {
    const sut = makeSut();
    const account = await sut.loadAccountByEmail("any_email@email.com");
    expect(account).toBeFalsy();
  });

  test("Should return an account on loadByToken without role", async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      _id: new ObjectId("67e1ee819d149752b1d4ba16"),
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
      accessToken: "any_token",
    });
    const account = await sut.loadByToken("67e1ee819d149752b1d4ba16");
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return an account on loadByToken with role", async () => {
    const sut = makeSut();
    await accountCollection.insertOne({
      _id: new ObjectId("67e1ee819d149752b1d4ba16"),
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
      accessToken: "any_token",
      role: "any_role",
    });
    const account = await sut.loadByToken(
      "67e1ee819d149752b1d4ba16",
      "any_role"
    );
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.password).toBe("any_password");
  });

  test("Should return null if loadByToken fails", async () => {
    const sut = makeSut();
    const account = await sut.loadByToken("67e1ee819d149752b1d4ba16");
    expect(account).toBeFalsy();
  });
});
