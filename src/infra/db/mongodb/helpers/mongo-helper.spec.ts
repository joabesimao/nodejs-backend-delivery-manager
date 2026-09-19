import { MongoHelper as sut } from "./mongo-helper";

describe("Mongo Helper ", () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL as string);
  });
  afterAll(async () => {
    await sut.disconect();
  });
  test("Should reconnect if mongo is down", async () => {
    let connection = await sut.getCollection("registers");
    expect(connection).toBeTruthy();
    await sut.disconect();
    connection = await sut.getCollection("registers");
    expect(connection).toBeTruthy();
  });

  test("Should map an object replacing _id with id", () => {
    const mapped = sut.map({ _id: "any_id", name: "any_name" });
    expect(mapped).toEqual({ id: "any_id", name: "any_name" });
  });
});
