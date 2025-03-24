import { LoadOrderDelivery } from "../../../domain/usescases/order-delivery/load-order-delivery";
import { LoadOrderDeliveryController } from "./load-order-delivery";
import { HttpRequest } from "../../protocols/http";
import { serverError } from "../../helpers/http/http-helper";
import { Validation } from "../../protocols/validation";
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
const makeOrdersDelivery = (): OrderDeliveryModel[] => [
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
    amount: 1,
    data: new Date("2022-10-10"),
    quantity: "12",
  },
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
    amount: 1,
    data: new Date("2022-10-10"),
    quantity: "12",
  },
];
interface SutTypes {
  sut: LoadOrderDeliveryController;
  loadOrderDeliveryStub: LoadOrderDelivery;
  validationStub: Validation;
}
const makeLoadOrderDeliveryStub = (): LoadOrderDelivery => {
  class LoadOrderStub implements LoadOrderDelivery {
    async loadAll(): Promise<OrderDeliveryModel[]> {
      return new Promise((resolve) => resolve(makeOrdersDelivery()));
    }
  }
  return new LoadOrderStub();
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
  const loadOrderDeliveryStub = makeLoadOrderDeliveryStub();
  const validationStub = makeValidation();
  const sut = new LoadOrderDeliveryController(
    loadOrderDeliveryStub,
    validationStub
  );
  return {
    sut,
    loadOrderDeliveryStub,
    validationStub,
  };
};

describe("LoadOrderDelivery Controller", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  beforeAll(() => {
    Mockdate.reset();
  });

  test("Should call LoadOrderDelivery with correct values", async () => {
    const { sut, loadOrderDeliveryStub } = makeSut();
    const loadRegisterSpy = jest.spyOn(loadOrderDeliveryStub, "loadAll");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(loadRegisterSpy).toHaveBeenCalled();
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = {
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
    };
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 500 if loadDeliverys throws", async () => {
    const { sut, loadOrderDeliveryStub } = makeSut();
    jest
      .spyOn(loadOrderDeliveryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()) as any)
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
