import { DbUpdateOrderDelivery } from "./db--update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateRegisterRepository } from "../../../protocols/db/register/update-register-repository";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../protocols/db/order-delivery/update-order-delivery";

const makeFakeUpdateOrderDelivery = (): UpdateOrderDeliveryModel => ({
  amount: 1,
  quantity: "1",
});

const makeFakeOrderDelivery = (): OrderDeliveryModel => ({
  register: {
    id: 2,
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
  quantity: "2",
  data: new Date("2010-10-10"),
});

interface SutTypes {
  sut: DbUpdateOrderDelivery;
  updateOrderDeliveryRepositoryStub: UpdateOrderDeliveryRepository;
}

const makeUpdateRepositoryStub = (): UpdateOrderDeliveryRepository => {
  class UpdateOrderDeliveryRepositoryStub
    implements UpdateOrderDeliveryRepository
  {
    async updateOrder(
      id: number,
      info: UpdateOrderDeliveryModel
    ): Promise<OrderDeliveryModel> {
      return new Promise((resolve) => resolve(makeFakeOrderDelivery()));
    }
  }
  return new UpdateOrderDeliveryRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateOrderDeliveryRepositoryStub = makeUpdateRepositoryStub();
  const sut = new DbUpdateOrderDelivery(updateOrderDeliveryRepositoryStub);
  return {
    sut,
    updateOrderDeliveryRepositoryStub,
  };
};

describe("DbUpdateOrderDelivery", () => {
  test("Should call UpdateOrderDeliveryRepository", async () => {
    const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(
      updateOrderDeliveryRepositoryStub,
      "updateOrder"
    );
    await sut.update(1, makeFakeUpdateOrderDelivery());
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should return one orderDelivery on success", async () => {
    const { sut } = makeSut();

    const registerUpdated = await sut.update(1, makeFakeUpdateOrderDelivery());
    expect(registerUpdated).toEqual(makeFakeOrderDelivery());
  });

  test("Should throw if UpdateOrderDeliveryRepository throws", async () => {
    const { sut, updateOrderDeliveryRepositoryStub } = makeSut();
    jest
      .spyOn(updateOrderDeliveryRepositoryStub, "updateOrder")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(2, makeFakeUpdateOrderDelivery());
    await expect(promise).rejects.toThrow();
  });
});
