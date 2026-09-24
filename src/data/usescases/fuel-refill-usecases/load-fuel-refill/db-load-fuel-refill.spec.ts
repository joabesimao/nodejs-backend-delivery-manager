import { DbLoadFuelRefill } from "./db-load-fuel-refill";
import { LoadFuelRefillRepository } from "../../../protocols/db/fuel-refill/load-fuel-refill";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";

interface SutTypes {
  sut: DbLoadFuelRefill;
  loadFuelRefillRepositoryStub: LoadFuelRefillRepository;
}

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

const makeLoadFuelRefillRepositoryStub = (): LoadFuelRefillRepository => {
  class LoadFuelRefillRepositoryStub implements LoadFuelRefillRepository {
    async loadAll(params?: any): Promise<FuelRefill[]> {
      return new Promise((resolve) => resolve(makeFakeRefills()));
    }
  }
  return new LoadFuelRefillRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadFuelRefillRepositoryStub = makeLoadFuelRefillRepositoryStub();
  const sut = new DbLoadFuelRefill(loadFuelRefillRepositoryStub);
  return { sut, loadFuelRefillRepositoryStub };
};

describe("DbLoadFuelRefill Usecase", () => {
  test("Should call LoadFuelRefillRepository with correct params", async () => {
    const { sut, loadFuelRefillRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadFuelRefillRepositoryStub, "loadAll");
    await sut.load({ vehicleId: 1 });
    expect(loadSpy).toHaveBeenCalledWith({ vehicleId: 1 });
  });

  test("Should throw if LoadFuelRefillRepository throws", async () => {
    const { sut, loadFuelRefillRepositoryStub } = makeSut();
    jest
      .spyOn(loadFuelRefillRepositoryStub, "loadAll")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of refills on success", async () => {
    const { sut } = makeSut();
    const refills = await sut.load();
    expect(refills).toEqual(makeFakeRefills());
  });
});
