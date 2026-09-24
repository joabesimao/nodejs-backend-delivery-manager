import { LoadVehicleController } from "./load-vehicle";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { LoadVehicle } from "../../../../domain/usescases/vehicle/load-vehicle";

const makeFakeRequest = (): HttpRequest => ({});

const makeFakeVehicles = (): Vehicle[] => [
  { id: 1, plate: "ABC1D23", model: "any_model" },
];

interface SutTypes {
  sut: LoadVehicleController;
  loadVehicleStub: LoadVehicle;
}

const makeLoadVehicleStub = (): LoadVehicle => {
  class LoadVehicleStub implements LoadVehicle {
    async load(): Promise<Vehicle[]> {
      return new Promise((resolve) => resolve(makeFakeVehicles()));
    }
  }
  return new LoadVehicleStub();
};

const makeSut = (): SutTypes => {
  const loadVehicleStub = makeLoadVehicleStub();
  const sut = new LoadVehicleController(loadVehicleStub);
  return {
    sut,
    loadVehicleStub,
  };
};

describe("LoadVehicle Controller", () => {
  test("Should return 500 if LoadVehicle throws", async () => {
    const { sut, loadVehicleStub } = makeSut();
    jest
      .spyOn(loadVehicleStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 with vehicles on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeVehicles()));
  });
});
