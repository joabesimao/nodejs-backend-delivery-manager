import { LoadOrderDeliveryById } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { LoadOrderDeliveryByIdController } from "./load-order-delivery-by-id";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
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
  params: 1,
});
const makeOrderDelivery = (): OrderDeliveryModel => ({
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
  sut: LoadOrderDeliveryByIdController;
  loadOrderDeliveryByIdStub: LoadOrderDeliveryById;
}

const makeLoadOrderDeliveryStub = (): LoadOrderDeliveryById => {
  class LoadOrderByIdStub implements LoadOrderDeliveryById {
    async loadOne(id: number): Promise<OrderDeliveryModel> {
      return new Promise((resolve) => resolve(makeOrderDelivery()));
    }
  }
  return new LoadOrderByIdStub();
};

const makeSut = (): SutTypes => {
  const loadOrderDeliveryByIdStub = makeLoadOrderDeliveryStub();
  const sut = new LoadOrderDeliveryByIdController(loadOrderDeliveryByIdStub);
  return {
    sut,
    loadOrderDeliveryByIdStub,
  };
};

describe("LoadOrderDeliveryById Controller", () => {
  beforeAll(() => {
    Mockdate.set(new Date());
  });

  beforeAll(() => {
    Mockdate.reset();
  });

  test("Should call LoadOrderDelivery with correct values", async () => {
    const { sut, loadOrderDeliveryByIdStub } = makeSut();
    const loadRegisterSpy = jest.spyOn(loadOrderDeliveryByIdStub, "loadOne");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(loadRegisterSpy).toHaveBeenCalled();
  });

  test("Should return 500 if loadDeliverys throws", async () => {
    const { sut, loadOrderDeliveryByIdStub } = makeSut();
    jest
      .spyOn(loadOrderDeliveryByIdStub, "loadOne")
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
    expect(httpResponse).toEqual(ok(makeOrderDelivery()));
  });
});
