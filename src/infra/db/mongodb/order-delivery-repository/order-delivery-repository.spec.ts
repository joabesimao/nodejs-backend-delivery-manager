import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { OrderDeliveryMongoRepository } from "../order-delivery-repository/order-delivery-repository";

const makeSut = (): OrderDeliveryMongoRepository => {
  const sut = new OrderDeliveryMongoRepository();
  return sut;
};

let ordemDeliveryCollection: Collection;

describe("OrderDelivery Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconect();
  });

  beforeEach(async () => {
    ordemDeliveryCollection = await MongoHelper.getCollection("orderDeliverys");
    await ordemDeliveryCollection.deleteMany();
  });

  test("Should add an OrderDelivery on success", async () => {
    const sut = makeSut();
    const orderOfDelivery = await sut.addOrderOfDelivery({
      register: {
        id: 1,
        client: {
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
      },
      amount: 2,
      quantity: "any_quantity",
      data: new Date("2000-01-10"),
    });
    expect(orderOfDelivery).toBeTruthy();
    expect(orderOfDelivery.register).toBeTruthy();
    expect(orderOfDelivery.register.client.name).toBe("any_name");
  });
});

/*   test("Should update the account accessToken on updateAccessToken on success", async () => {
    const sut = makeSut();
    const res = await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
    expect(res).toBeTruthy();
    await sut.updateAccessToken(Number(res.insertedId), "any_token");
    const account = await accountCollection.findOne({ _id: res.insertedId });
    expect(account).toBeTruthy();
    expect(account.accessToken).toBe("any_token");
  }); */
