import { LoadDeliverymanController } from "./load-deliveryman";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { LoadDeliveryman } from "../../../../domain/usescases/deliveryman/load-deliveryman";

const makeFakeDeliverymanList = (): Deliveryman[] => [
  {
    id: 1,
    name: "any_name",
    lastName: "any_lastName",
    numberQualification: "any_numberQualification",
    phone: "any_phone",
  },
  {
    id: 2,
    name: "other_name",
    lastName: "other_lastName",
    numberQualification: "other_numberQualification",
    phone: "other_phone",
  },
];

interface SutTypes {
  sut: LoadDeliverymanController;
  loadDeliverymanStub: LoadDeliveryman;
}

const makeLoadDeliverymanStub = (): LoadDeliveryman => {
  class LoadDeliverymanStub implements LoadDeliveryman {
    async load(): Promise<Deliveryman[]> {
      return await new Promise((resolve) => resolve(makeFakeDeliverymanList()));
    }
  }
  return new LoadDeliverymanStub();
};

const makeSut = (): SutTypes => {
  const loadDeliverymanStub = makeLoadDeliverymanStub();
  const sut = new LoadDeliverymanController(loadDeliverymanStub);
  return {
    sut,
    loadDeliverymanStub,
  };
};

describe("LoadDeliveryman Controller", () => {
  test("Should call LoadDeliveryman with correct values", async () => {
    const { sut, loadDeliverymanStub } = makeSut();
    const loadSpy = jest.spyOn(loadDeliverymanStub, "load");
    await sut.handle({});
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should return 500 if LoadDeliveryman throws", async () => {
    const { sut, loadDeliverymanStub } = makeSut();
    jest
      .spyOn(loadDeliverymanStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(ok(makeFakeDeliverymanList()));
  });
});
