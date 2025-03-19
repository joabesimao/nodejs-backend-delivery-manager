import { DbLoadOrderDelivery } from "./db-load-order-delivery";
import { OrderDeliveryModel } from "../../../domain/models/order-delivery/order-delivery";
import { LoadOrderDeliveryRepository } from "../../protocols/db/order-delivery/load-order-delivery";

interface SutTypes {
  sut: DbLoadOrderDelivery;
  loadOrderDeliveryRepositoryStub: LoadOrderDeliveryRepository;
}

const makeOrders = (): OrderDeliveryModel[] => [
  {
    id: "1",
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
    amount: 10,
    data: new Date(),
    quantity: "6",
  },
  {
    id: "10",
    register: {
      id: 3,
      client: {
        name: "other_name",
        lastName: "other_last_name",
        phone: "other_phone",
      },
      address: {
        street: "other_street",
        neighborhood: "other_neighborhood",
        numberHouse: 123,
        reference: "other_reference",
        city: "other_city",
      },
    },
    amount: 11,
    data: new Date(),
    quantity: "7",
  },
];

const makeLoadOrderDeliveryRepository = (): LoadOrderDeliveryRepository => {
  class LoadOrderDeliveryRepositoryStub implements LoadOrderDeliveryRepository {
    async getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]> {
      return new Promise((resolve) => resolve(makeOrders()));
    }
  }
  return new LoadOrderDeliveryRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadOrderDeliveryRepositoryStub = makeLoadOrderDeliveryRepository();
  const sut = new DbLoadOrderDelivery(loadOrderDeliveryRepositoryStub);
  return {
    sut,
    loadOrderDeliveryRepositoryStub,
  };
};

describe("DbLoadOrderDelivery Usecase", () => {
  test("Should call LoadOrderDeliveryRepository with correct values", async () => {
    const { sut, loadOrderDeliveryRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadOrderDeliveryRepositoryStub,
      "getAllOrderOfDelivery"
    );
    await sut.loadAll();
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return an OrderDelivery on success", async () => {
    const { sut } = makeSut();

    const order = await sut.loadAll();
    expect(order).toEqual(makeOrders());
  });

  test("Should throw if AddOrderDeliveryRepository throws", async () => {
    const { sut, loadOrderDeliveryRepositoryStub } = makeSut();
    jest
      .spyOn(loadOrderDeliveryRepositoryStub, "getAllOrderOfDelivery")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow();
  });
});
