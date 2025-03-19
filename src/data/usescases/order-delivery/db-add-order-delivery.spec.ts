import { DbAddOrderDelivery } from "./db-add-order-delivery";
import { AddOrderDeliveryRepository } from "../../protocols/db/order-delivery/add-order-delivery";
import { OrderDeliveryModel } from "../../../domain/models/order-delivery/order-delivery";
import { AddOrderDeliveryModel } from "../../../domain/usescases/order-delivery/add-order-delivery";

interface SutTypes {
  sut: DbAddOrderDelivery;
  addOrderDeliveryRepositoryStub: AddOrderDeliveryRepository;
}

const makeOrder = (): OrderDeliveryModel => ({
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
});

const makeOrderDeliveryRepository = (): AddOrderDeliveryRepository => {
  class OrderDeliveryRepositoryStub implements AddOrderDeliveryRepository {
    async addOrderOfDelivery(
      orderOfDelivery: AddOrderDeliveryModel
    ): Promise<OrderDeliveryModel> {
      return new Promise((resolve) => resolve(makeOrder()));
    }
  }
  return new OrderDeliveryRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addOrderDeliveryRepositoryStub = makeOrderDeliveryRepository();
  const sut = new DbAddOrderDelivery(addOrderDeliveryRepositoryStub);
  return {
    sut,
    addOrderDeliveryRepositoryStub,
  };
};

const makeAddOrderDelivery = (): AddOrderDeliveryModel => ({
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
  data: new Date("2012-10-21"),
  quantity: "6",
});

describe("DbAddOrderDelivery Usecase", () => {
  test("Should call AddOrderDeliveryRepository with correct values", async () => {
    const { sut, addOrderDeliveryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(
      addOrderDeliveryRepositoryStub,
      "addOrderOfDelivery"
    );
    await sut.addOrderDelivery(makeAddOrderDelivery());
    expect(addSpy).toHaveBeenCalledWith(makeAddOrderDelivery());
  });

  test("Should throw if AddOrderDeliveryRepository throws", async () => {
    const { sut, addOrderDeliveryRepositoryStub } = makeSut();
    jest
      .spyOn(addOrderDeliveryRepositoryStub, "addOrderOfDelivery")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.addOrderDelivery(makeAddOrderDelivery());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an OrderDelivery on success", async () => {
    const { sut } = makeSut();

    const register = await sut.addOrderDelivery(makeAddOrderDelivery());
    expect(register).toEqual(makeOrder());
  });
});
