import {
  AddOrderDelivery,
  AddOrderDeliveryModel,
} from "../../../domain/usescases/order-delivery/add-order-delivery";
import { AddOrderDeliveryController } from "./add-order-delivery";
import { HttpRequest } from "../../protocols/http";
import { ok, serverError } from "../../helpers/http/http-helper";
import { Validation } from "../../protocols/validation";
import { MissingParamError } from "../../errors";
import { OrderDeliveryModel } from "../../../domain/models/order-delivery/order-delivery";
import Mockdate from "mockdate";

const makeFakeRequest = (): HttpRequest => ({
  body: {
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
    amount: 1,
    data: new Date("2022-10-10"),
    quantity: "12",
  },
});
const makeOrdemDelivery = (): OrderDeliveryModel => ({
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
  amount: 1,
  data: new Date("2022-10-10"),
  quantity: "12",
});
interface SutTypes {
  sut: AddOrderDeliveryController;
  addOrderDeliveryStub: AddOrderDelivery;
}
const makeAddOrderDeliveryStub = (): AddOrderDelivery => {
  class AddOrderStub implements AddOrderDelivery {
    async addOrderDelivery(
      data: AddOrderDeliveryModel
    ): Promise<OrderDeliveryModel> {
      return new Promise((resolve) => resolve(makeOrdemDelivery()));
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

  const sut = new AddOrderDeliveryController(addOrderDeliveryStub);
  return {
    sut,
    addOrderDeliveryStub,
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
      amount: 1,
      data: new Date("2022-10-10T00:00:00.000Z"),
      quantity: "12",
      register: {
        address: {
          city: "any_city",
          neighborhood: "any_neighborhood",
          numberHouse: 123,
          reference: "any_reference",
          street: "any_street",
        },
        client: {
          lastName: "any_last_name",
          name: "any_name",
          phone: "any_phone",
        },
        id: 1,
      },
    });
  });

  test("Should return 400 if not register provided", async () => {
    const { sut } = makeSut();

    const fakeRequest: HttpRequest = {
      body: {
        id: "1",
        amount: 1,
        data: new Date("2022-10-10"),
        quantity: "12",
      },
    };
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("register"));
  });

  test("Should return 400 if not amount provided", async () => {
    const { sut } = makeSut();

    const fakeRequest: HttpRequest = {
      body: {
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
        data: new Date("2022-10-10"),
        quantity: "12",
      },
    };
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("amount"));
  });

  test("Should return 400 if not data provided", async () => {
    const { sut } = makeSut();

    const fakeRequest: HttpRequest = {
      body: {
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
        amount: 1,
        quantity: "12",
      },
    };
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("data"));
  });

  test("Should return 400 if not data provided", async () => {
    const { sut } = makeSut();

    const fakeRequest: HttpRequest = {
      body: {
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
        amount: 1,
        data: new Date("2022-10-10"),
      },
    };
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("quantity"));
  });

  test("Should return 500 if AddOrdersDelivery throws", async () => {
    const { sut, addOrderDeliveryStub } = makeSut();
    jest
      .spyOn(addOrderDeliveryStub, "addOrderDelivery")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()) as any)
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeOrdemDelivery()));
  });
});
