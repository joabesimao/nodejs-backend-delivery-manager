import { DbLoadVehicle } from "./db-load-vehicle";
import { LoadVehicleRepository } from "../../../protocols/db/vehicle/load-vehicle";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";

interface SutTypes {
  sut: DbLoadVehicle;
  loadVehicleRepositoryStub: LoadVehicleRepository;
}

const makeVehicles = (): Vehicle[] => [
  { id: 1, plate: "ABC1D23", model: "any_model", brand: "any_brand", deliverymanId: 1 },
];

const makeLoadVehicleRepository = (): LoadVehicleRepository => {
  class LoadVehicleRepositoryStub implements LoadVehicleRepository {
    async loadAll(): Promise<Vehicle[]> {
      return await new Promise((resolve) => resolve(makeVehicles()));
    }
  }
  return new LoadVehicleRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadVehicleRepositoryStub = makeLoadVehicleRepository();
  const sut = new DbLoadVehicle(loadVehicleRepositoryStub);
  return {
    sut,
    loadVehicleRepositoryStub,
  };
};

describe("DbLoadVehicle Usecase", () => {
  test("Should call LoadVehicleRepository", async () => {
    const { sut, loadVehicleRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadVehicleRepositoryStub, "loadAll");
    await sut.load();
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should throw if LoadVehicleRepository throws", async () => {
    const { sut, loadVehicleRepositoryStub } = makeSut();
    jest
      .spyOn(loadVehicleRepositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of vehicles on success", async () => {
    const { sut } = makeSut();
    const vehicles = await sut.load();
    expect(vehicles).toEqual(makeVehicles());
  });
});
