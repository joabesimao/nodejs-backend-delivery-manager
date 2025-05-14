import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { OrderDeliveryMongoRepository } from "../order-delivery-repository/order-delivery-repository";

const makeSut = (): OrderDeliveryMongoRepository => {
  const sut = new OrderDeliveryMongoRepository();
  return sut;
};

const makeOrderDelivery = {
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
  registerId: 1,
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
    const orderOfDelivery = await sut.addOrderOfDelivery(makeOrderDelivery);
    expect(orderOfDelivery).toBeTruthy();
    expect(orderOfDelivery.register).toBeTruthy();
    expect(orderOfDelivery.register.client.name).toBe("any_name");
  });

  test("Should return  an list of  OrderDelivery on success", async () => {
    const sut = makeSut();
    await sut.addOrderOfDelivery({
      registerId: 1,
      amount: 2,
      quantity: "any_quantity",
      data: new Date("2000-01-10"),
    });

    await sut.addOrderOfDelivery({
      registerId: 1,
      amount: 2,
      quantity: "other_quantity",
      data: new Date("2000-01-10"),
    });

    const orderOfDelivery = await sut.getAllOrderOfDelivery();
    expect(orderOfDelivery).toBeTruthy();
    expect(orderOfDelivery[0].register.client.name).toBe("any_name");
    expect(orderOfDelivery[1].register.client.name).toBe("any_name");
    expect(orderOfDelivery.length).toBe(2);
  });

  test("Should delete order delivery by id on success", async () => {
    const id = 7;
    const sut = makeSut();
    const orderOfDelivery = await sut.deleteById(id);
    expect(orderOfDelivery).toBeTruthy();
    expect(orderOfDelivery).toBe("Pedido de Entrega Deletado com sucesso!");
  });
});
