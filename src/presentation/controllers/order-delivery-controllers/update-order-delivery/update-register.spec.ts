import { UpdateOrderDeliveryController } from "./update-order-delivery";
import { HttpRequest } from "../../../protocols/http";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { InvalidParamError } from "../../../errors/invalid-params-error";

interface SutTypes {
  sut: UpdateOrderDeliveryController;
  updateOrderDeliveryStub: UpdateOrderDelivery;
}

const fakehttpRequest = (): HttpRequest => ({
  body: {
    register: {
      id: 1,
      client: {
        name: "any_name",
        cpf: "any_cpf",
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
  id: 1,
  status: "actived",
  register: {
    id: 1,
    client: {
      name: "any_name",
      cpf: "any_cpf",
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
    expect(updateSpy).toHaveBeenCalledWith(1, {
      ...fakehttpRequest().body,
      accountId: undefined,
    });
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

  test("Should return 400 if id is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      ...fakehttpRequest(),
      params: { id: "not_a_number" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("id")));
  });

  test("Should return 400 if id is less than or equal to 0", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      ...fakehttpRequest(),
      params: { id: 0 },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("id")));
  });

  test("Should return 400 if amount is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      ...fakehttpRequest(),
      body: { ...fakehttpRequest().body, amount: "" },
    });
    expect(
      httpResponse
    ).toEqual(badRequest(new InvalidParamError("amount")));
  });

  test("Should return 400 if amount is less than or equal to 0", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      ...fakehttpRequest(),
      body: { ...fakehttpRequest().body, amount: 0 },
    });
    expect(
      httpResponse
    ).toEqual(badRequest(new InvalidParamError("amount")));
  });

  test("Should correctly parse a string amount using comma as decimal separator", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryStub, "update");
    await sut.handle({
      ...fakehttpRequest(),
      body: { ...fakehttpRequest().body, amount: "1.234,56" },
    });
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ amount: 1234.56 })
    );
  });

  test("Should correctly parse a string amount using only a comma as decimal separator", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryStub, "update");
    await sut.handle({
      ...fakehttpRequest(),
      body: { ...fakehttpRequest().body, amount: "10,50" },
    });
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ amount: 10.5 })
    );
  });

  test("Should not parse amount when it is undefined in the body", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryStub, "update");
    const { amount, ...bodyWithoutAmount } = fakehttpRequest().body as any;
    await sut.handle({
      ...fakehttpRequest(),
      body: bodyWithoutAmount,
    });
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      expect.not.objectContaining({ amount: expect.anything() })
    );
  });

  test("Should return 400 if deliverymanId is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      ...fakehttpRequest(),
      body: { ...fakehttpRequest().body, deliverymanId: "not_a_number" },
    });
    expect(
      httpResponse
    ).toEqual(badRequest(new InvalidParamError("deliverymanId")));
  });

  test("Should correctly parse a valid deliverymanId", async () => {
    const { sut, updateOrderDeliveryStub } = makeSut();
    const updateSpy = jest.spyOn(updateOrderDeliveryStub, "update");
    await sut.handle({
      ...fakehttpRequest(),
      body: { ...fakehttpRequest().body, deliverymanId: "3" },
    });
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ deliverymanId: 3 })
    );
  });
});
