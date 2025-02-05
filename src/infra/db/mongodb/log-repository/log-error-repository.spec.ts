import { Collection } from "mongodb";
import { LogMongoRepository } from "./log-mongo-repository";
import { MongoHelper } from "../helpers/mongo-helper";

describe("Log Error Mongo Repository", () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  test("Should create an error log on success", async () => {
    const sut = new LogMongoRepository();
    await sut.log("any_error");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
