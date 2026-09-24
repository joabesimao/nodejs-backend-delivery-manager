import { LoadFuelRefillController } from "./load-fuel-refill";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { LoadFuelRefill, LoadFuelRefillParams } from "../../../../domain/usescases/fuel-refill/load-fuel-refill";

const makeFakeRequest = (): HttpRequest => ({ query: { vehicleId: "1" } });

const makeFakeRefills = (): FuelRefill[] => [
  {
    id: 1,
    vehicleId: 1,
    deliverymanId: 1,
    km: 1000,
    liters: 20,
    totalValue: 150,
    refillDate: new Date(),
    createdAt: new Date(),
  },
];

interface SutTypes {
  sut: LoadFuelRefillController;
  loadFuelRefillStub: LoadFuelRefill;
}

const makeLoadFuelRefillStub = (): LoadFuelRefill => {
  class LoadFuelRefillStub implements LoadFuelRefill {
    async load(params?: LoadFuelRefillParams): Promise<FuelRefill[]> {
      return new Promise((resolve) => resolve(makeFakeRefills()));
    }
  }
  return new LoadFuelRefillStub();
};

const makeSut = (): SutTypes => {
  const loadFuelRefillStub = makeLoadFuelRefillStub();
  const sut = new LoadFuelRefillController(loadFuelRefillStub);
  return { sut, loadFuelRefillStub };
};

describe("LoadFuelRefill Controller", () => {
  test("Should call LoadFuelRefill with query params", async () => {
    const { sut, loadFuelRefillStub } = makeSut();
    const loadSpy = jest.spyOn(loadFuelRefillStub, "load");
    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith({ vehicleId: 1 });
  });

  test("Should return 500 if LoadFuelRefill throws", async () => {
    const { sut, loadFuelRefillStub } = makeSut();
    jest
      .spyOn(loadFuelRefillStub, "load")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 with refills on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeRefills()));
  });
});
