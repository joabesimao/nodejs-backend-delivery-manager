import { DbAddFuelRefill } from "./db-add-fuel-refill";
import { AddFuelRefillRepository } from "../../../protocols/db/fuel-refill/add-fuel-refill";
import { FindLastFuelRefillRepository } from "../../../protocols/db/fuel-refill/find-last-fuel-refill";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { InvalidKmError } from "../../../../presentation/errors";

interface SutTypes {
  sut: DbAddFuelRefill;
  findLastFuelRefillRepositoryStub: FindLastFuelRefillRepository;
  addFuelRefillRepositoryStub: AddFuelRefillRepository;
}

const makeFakeFuelRefill = (): FuelRefill => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  previousKm: undefined,
  kmDriven: undefined,
  liters: 20,
  totalValue: 150,
  refillDate: new Date(),
  createdAt: new Date(),
});

const makeAddFuelRefillModel = (): AddFuelRefillModel => ({
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  liters: 20,
  totalValue: 150,
  refillDate: new Date(),
});

const makeFindLastFuelRefillRepositoryStub = (): FindLastFuelRefillRepository => {
  class FindLastFuelRefillRepositoryStub implements FindLastFuelRefillRepository {
    async findLastByVehicle(vehicleId: number): Promise<FuelRefill | null> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new FindLastFuelRefillRepositoryStub();
};

const makeAddFuelRefillRepositoryStub = (): AddFuelRefillRepository => {
  class AddFuelRefillRepositoryStub implements AddFuelRefillRepository {
    async add(data: any): Promise<FuelRefill> {
      return new Promise((resolve) => resolve(makeFakeFuelRefill()));
    }
  }
  return new AddFuelRefillRepositoryStub();
};

const makeSut = (): SutTypes => {
  const findLastFuelRefillRepositoryStub = makeFindLastFuelRefillRepositoryStub();
  const addFuelRefillRepositoryStub = makeAddFuelRefillRepositoryStub();
  const sut = new DbAddFuelRefill(findLastFuelRefillRepositoryStub, addFuelRefillRepositoryStub);
  return { sut, findLastFuelRefillRepositoryStub, addFuelRefillRepositoryStub };
};

describe("DbAddFuelRefill Usecase", () => {
  test("Should call FindLastFuelRefillRepository with correct vehicleId", async () => {
    const { sut, findLastFuelRefillRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findLastFuelRefillRepositoryStub, "findLastByVehicle");
    await sut.add(makeAddFuelRefillModel());
    expect(findSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw InvalidKmError if km is lower than or equal to last refill km", async () => {
    const { sut, findLastFuelRefillRepositoryStub } = makeSut();
    jest.spyOn(findLastFuelRefillRepositoryStub, "findLastByVehicle").mockReturnValueOnce(
      new Promise((resolve) => resolve({ ...makeFakeFuelRefill(), km: 1000 }))
    );
    const promise = sut.add(makeAddFuelRefillModel());
    await expect(promise).rejects.toEqual(new InvalidKmError());
  });

  test("Should add without previousKm/kmDriven on first refill for the vehicle", async () => {
    const { sut, addFuelRefillRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addFuelRefillRepositoryStub, "add");
    await sut.add(makeAddFuelRefillModel());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddFuelRefillModel(),
      previousKm: undefined,
      kmDriven: undefined,
    });
  });

  test("Should compute previousKm and kmDriven from the last refill", async () => {
    const { sut, findLastFuelRefillRepositoryStub, addFuelRefillRepositoryStub } = makeSut();
    jest.spyOn(findLastFuelRefillRepositoryStub, "findLastByVehicle").mockReturnValueOnce(
      new Promise((resolve) => resolve({ ...makeFakeFuelRefill(), km: 600 }))
    );
    const addSpy = jest.spyOn(addFuelRefillRepositoryStub, "add");
    await sut.add(makeAddFuelRefillModel());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddFuelRefillModel(),
      previousKm: 600,
      kmDriven: 400,
    });
  });

  test("Should throw if AddFuelRefillRepository throws", async () => {
    const { sut, addFuelRefillRepositoryStub } = makeSut();
    jest
      .spyOn(addFuelRefillRepositoryStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(makeAddFuelRefillModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return a FuelRefill on success", async () => {
    const { sut } = makeSut();
    const refill = await sut.add(makeAddFuelRefillModel());
    expect(refill).toEqual(makeFakeFuelRefill());
  });
});
