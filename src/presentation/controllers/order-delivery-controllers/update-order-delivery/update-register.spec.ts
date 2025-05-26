import { UpdateOrderDeliveryController } from "./update-order-delivery";
import { HttpRequest } from "../../../protocols/http";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";

interface SutTypes {
  sut: UpdateOrderDeliveryController;
  updateOrderDeliveryStub: UpdateOrderDelivery;
}

const fakehttpRequest = (): HttpRequest => ({
  body: {
    register: {
      id: 1,
      client: {
        lastName: "ultimo_nome",
        name: "any_name",
        phone: "123456747",
      },
      address: {
        street: "any_rua",
        neighborhood: "any_bairro",
        numberHouse: 1,
        reference: "any_referencia",
        city: "any_city",
      },
    },
    amount: 1,
    quantity: "1",
    data: new Date("2010-10-10"),
  },
  params: {
    id: 1,
  },
});

const makeFakeOrder = (): OrderDeliveryModel => ({
  register: {
    id: 1,
    client: {
      lastName: "ultimo_nome",
      name: "any_name",
      phone: "123456747",
    },
    address: {
      street: "any_rua",
      neighborhood: "any_bairro",
      numberHouse: 1,
      reference: "any_referencia",
      city: "any_city",
    },
  },
  amount: 1,
  quantity: "1",
  data: new Date("2010-10-10"),
});

const makeUpdateOrderDelivery = (): UpdateOrderDelivery => {
  class UpdateOrderStub implements UpdateOrderDelivery {
    async update(
      id: number,
      info: UpdateOrderDeliveryModel
    ): Promise<OrderDeliveryModel> {
      return new Promise((resolve) => resolve(makeFakeOrder()));
    }
  }
  return new UpdateOrderStub();
};

const makeSut = (): SutTypes => {
  const updateOrderDeliveryStub = makeUpdateOrderDelivery();
  const sut = new UpdateOrderDeliveryController(updateOrderDeliveryStub);
  return {
    sut,
    updateOrderDeliveryStub,
  };
};

describe("Update one Order Delivery Controller", () => {
  test("Should call update", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryStub, "update");
    await sut.handle(fakehttpRequest());
    expect(updateSpy).toHaveBeenCalled();
  });

  test("Should call update with correct values", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryStub, "update");

    await sut.handle(fakehttpRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, makeFakeOrder());
  });

  test("Should call UpdateOrderDeliveryController on success", async () => {
    const { sut } = makeSut();

    const updateData = await sut.handle(fakehttpRequest());
    expect(updateData).toEqual(ok(makeFakeOrder()));
  });

  test("Should return 500 if UpdateRegisterController throws", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    jest
      .spyOn(updateOrderDeliveryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakehttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
