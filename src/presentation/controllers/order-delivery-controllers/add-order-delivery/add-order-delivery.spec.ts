import {
  AddOrderDelivery,
  AddOrderDeliveryModel,
} from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { AddOrderDeliveryController } from "./add-order-delivery";
import { HttpRequest } from "../../../protocols/http";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Validation } from "../../../protocols/validation";
import { MissingParamError } from "../../../errors";
import { InvalidParamError } from "../../../errors/invalid-params-error";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import Mockdate from "mockdate";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    registerId: 1,
    deliverymanId: 2,
    amount: 1,
    data: new Date("2022-10-10"),
    quantity: "12",
  },
});

const makeOrderDelivery = (): OrderDeliveryModel => ({
  id: 1,
  status: "actived",
  register: {
    id: 1,
    client: {
      name: "any_name",
      cpf: "any_cpf",
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
  amount: 1,
  data: new Date("2022-10-10"),
  quantity: "12",
});
interface SutTypes {
  sut: AddOrderDeliveryController;
  addOrderDeliveryStub: AddOrderDelivery;
  validationStub: Validation;
}
const makeAddOrderDeliveryStub = (): AddOrderDelivery => {
  class AddOrderStub implements AddOrderDelivery {
    async addOrderDelivery(
      data: AddOrderDeliveryModel
    ): Promise<OrderDeliveryModel> {
      return new Promise((resolve) => resolve(makeOrderDelivery()));
    }
  }
  return new AddOrderStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const addOrderDeliveryStub = makeAddOrderDeliveryStub();
  const validationStub = makeValidation();
  const sut = new AddOrderDeliveryController(
    addOrderDeliveryStub,
    validationStub
  );
  return {
    sut,
    addOrderDeliveryStub,
    validationStub,
  };
};
describe("addOrderDelivery Controller", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  beforeAll(() => {
    Mockdate.reset();
  });

  test("Should call addOrderDelivery with correct values", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    const addRegisterSpy = jest.spyOn(addOrderDeliveryStub, "addOrderDelivery");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(addRegisterSpy).toHaveBeenCalledWith({
      registerId: 1,
      deliverymanId: 2,
      amount: 1,
      data: new Date("2022-10-10T00:00:00.000Z"),
      quantity: "12",
      accountId: undefined,
    });
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 500 if Validation return an Error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  test("Should return 400 if registerId is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      body: { ...makeFakeRequest().body, registerId: "not_a_number" },
    });
    expect(httpResponse.statusCode).toBe(400);
  });

  test("Should return 500 if AddOrdersDelivery throws", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    jest
      .spyOn(addOrderDeliveryStub, "addOrderDelivery")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeOrderDelivery()));
  });

  test("Should return 400 if amount is an empty string", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      body: { ...makeFakeRequest().body, amount: "" },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("amount")));
  });

  test("Should return 400 if amount is less than or equal to 0", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      body: { ...makeFakeRequest().body, amount: 0 },
    });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("amount")));
  });

  test("Should correctly parse amount using dot as thousands separator and comma as decimal separator", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    const addOrderDeliverySpy = jest.spyOn(
      addOrderDeliveryStub,
      "addOrderDelivery"
    );
    await sut.handle({
      body: { ...makeFakeRequest().body, amount: "1.234,56" },
    });
    expect(addOrderDeliverySpy).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1234.56 })
    );
  });

  test("Should correctly parse amount using comma as thousands separator and dot as decimal separator", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    const addOrderDeliverySpy = jest.spyOn(
      addOrderDeliveryStub,
      "addOrderDelivery"
    );
    await sut.handle({
      body: { ...makeFakeRequest().body, amount: "1,234.56" },
    });
    expect(addOrderDeliverySpy).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1234.56 })
    );
  });

  test("Should correctly parse amount using comma only as decimal separator", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    const addOrderDeliverySpy = jest.spyOn(
      addOrderDeliveryStub,
      "addOrderDelivery"
    );
    await sut.handle({
      body: { ...makeFakeRequest().body, amount: "10,50" },
    });
    expect(addOrderDeliverySpy).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 10.5 })
    );
  });

  test("Should return 400 if deliverymanId is invalid", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({
      body: { ...makeFakeRequest().body, deliverymanId: "not_a_number" },
    });
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("deliverymanId"))
    );
  });

  test("Should return badRequest if AddOrderDelivery throws a known business error", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    jest
      .spyOn(addOrderDeliveryStub, "addOrderDelivery")
      .mockReturnValueOnce(
        new Promise((resolve, reject) =>
          reject(new Error("Cadastro nao encontrado"))
        )
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(
      badRequest(new Error("Cadastro nao encontrado"))
    );
  });
});
