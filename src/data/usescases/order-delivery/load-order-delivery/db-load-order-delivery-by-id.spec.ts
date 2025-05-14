import { DbLoadOrderDeliveryById } from "./db-load-order-delivery-by-id";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { LoadOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/load-order-delivery";
import Mockdate from "mockdate";

interface SutTypes {
  sut: DbLoadOrderDeliveryById;
  loadOrderDeliveryRepositoryByIdStub: LoadOrderDeliveryByIdRepository;
}

const makeLoadOrderDeliveryRepositoryByIdStub =
  (): LoadOrderDeliveryByIdRepository => {
    class LoadOrderDeliveryRepositoryStub
      implements LoadOrderDeliveryByIdRepository
    {
      async getOneOrderOfDelivery(): Promise<OrderDeliveryModel> {
        return new Promise((resolve) => resolve(makeOrder()));
      }
    }
    return new LoadOrderDeliveryRepositoryStub();
  };

const makeSut = (): SutTypes => {
  const loadOrderDeliveryRepositoryByIdStub =
    makeLoadOrderDeliveryRepositoryByIdStub();
  const sut = new DbLoadOrderDeliveryById(loadOrderDeliveryRepositoryByIdStub);
  return {
    sut,
    loadOrderDeliveryRepositoryByIdStub,
  };
};

const makeOrder = (): OrderDeliveryModel => ({
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
  data: new Date("2022-10-10"),
  quantity: "6",
});

describe("DbLoadOrderDeliveryById Usecase", () => {
  beforeAll(() => {
    Mockdate.set(new Date("2022-10-10"));
  });

  beforeAll(() => {
    Mockdate.reset();
  });
  const id = 8;

  test("Should call LoadOrderDeliveryRepositoryById with correct values", async () => {
    const { sut, loadOrderDeliveryRepositoryByIdStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadOrderDeliveryRepositoryByIdStub,
      "getOneOrderOfDelivery"
    );
    await sut.loadOne(id);
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return an OrderDeliveryById on success", async () => {
    const { sut } = makeSut();
    const order = await sut.loadOne(id);
    expect(order).toEqual(makeOrder());
  });

  test("Should throw if AddOrderDeliveryRepositoryById throws", async () => {
    const { sut, loadOrderDeliveryRepositoryByIdStub } = makeSut();
    jest
      .spyOn(loadOrderDeliveryRepositoryByIdStub, "getOneOrderOfDelivery")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.loadOne(id);
    await expect(promise).rejects.toThrow();
  });
});
