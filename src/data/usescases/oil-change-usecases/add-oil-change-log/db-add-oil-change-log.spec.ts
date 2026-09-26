import { DbAddOilChangeLog } from "./db-add-oil-change-log";
import { AddOilChangeLogRepository } from "../../../protocols/db/oil-change/add-oil-change-log";
import { FindLastOilChangeLogRepository } from "../../../protocols/db/oil-change/find-last-oil-change-log";
import { LoadOilChangeConfigRepository } from "../../../protocols/db/oil-change/load-oil-change-config";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { InvalidKmError } from "../../../../presentation/errors";

interface SutTypes {
  sut: DbAddOilChangeLog;
  loadOilChangeConfigRepositoryStub: LoadOilChangeConfigRepository;
  findLastOilChangeLogRepositoryStub: FindLastOilChangeLogRepository;
  addOilChangeLogRepositoryStub: AddOilChangeLogRepository;
}

const makeFakeConfig = (): OilChangeConfig => ({
  id: 1,
  intervalKm: 800,
  updatedAt: new Date("2026-09-23T00:00:00.000Z"),
});

const makeFakeOilChangeLog = (): OilChangeLog => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  nextChangeKm: 1800,
  changeDate: new Date("2026-09-23T00:00:00.000Z"),
  createdAt: new Date("2026-09-23T00:00:00.000Z"),
});

const makeAddOilChangeLogModel = (): AddOilChangeLogModel => ({
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  changeDate: new Date("2026-09-23T00:00:00.000Z"),
});

const makeLoadOilChangeConfigRepositoryStub = (): LoadOilChangeConfigRepository => {
  class LoadOilChangeConfigRepositoryStub implements LoadOilChangeConfigRepository {
    async load(): Promise<OilChangeConfig> {
      return await new Promise((resolve) => resolve(makeFakeConfig()));
    }
  }
  return new LoadOilChangeConfigRepositoryStub();
};

const makeFindLastOilChangeLogRepositoryStub = (): FindLastOilChangeLogRepository => {
  class FindLastOilChangeLogRepositoryStub implements FindLastOilChangeLogRepository {
    async findLastByVehicle(vehicleId: number): Promise<OilChangeLog | null> {
      return await new Promise((resolve) => resolve(null));
    }
  }
  return new FindLastOilChangeLogRepositoryStub();
};

const makeAddOilChangeLogRepositoryStub = (): AddOilChangeLogRepository => {
  class AddOilChangeLogRepositoryStub implements AddOilChangeLogRepository {
    async add(data: any): Promise<OilChangeLog> {
      return await new Promise((resolve) => resolve(makeFakeOilChangeLog()));
    }
  }
  return new AddOilChangeLogRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadOilChangeConfigRepositoryStub = makeLoadOilChangeConfigRepositoryStub();
  const findLastOilChangeLogRepositoryStub = makeFindLastOilChangeLogRepositoryStub();
  const addOilChangeLogRepositoryStub = makeAddOilChangeLogRepositoryStub();
  const sut = new DbAddOilChangeLog(
    loadOilChangeConfigRepositoryStub,
    findLastOilChangeLogRepositoryStub,
    addOilChangeLogRepositoryStub
  );
  return {
    sut,
    loadOilChangeConfigRepositoryStub,
    findLastOilChangeLogRepositoryStub,
    addOilChangeLogRepositoryStub,
  };
};

describe("DbAddOilChangeLog Usecase", () => {
  test("Should call FindLastOilChangeLogRepository with correct vehicleId", async () => {
    const { sut, findLastOilChangeLogRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findLastOilChangeLogRepositoryStub, "findLastByVehicle");
    await sut.add(makeAddOilChangeLogModel());
    expect(findSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw InvalidKmError if km is lower than or equal to last log km", async () => {
    const { sut, findLastOilChangeLogRepositoryStub } = makeSut();
    jest.spyOn(findLastOilChangeLogRepositoryStub, "findLastByVehicle").mockReturnValueOnce(
      new Promise((resolve) => resolve({ ...makeFakeOilChangeLog(), km: 1000 }))
    );
    const promise = sut.add(makeAddOilChangeLogModel());
    await expect(promise).rejects.toEqual(new InvalidKmError());
  });

  test("Should compute nextChangeKm using the configured interval", async () => {
    const { sut, addOilChangeLogRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addOilChangeLogRepositoryStub, "add");
    await sut.add(makeAddOilChangeLogModel());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddOilChangeLogModel(),
      nextChangeKm: 1800,
    });
  });

  test("Should throw if AddOilChangeLogRepository throws", async () => {
    const { sut, addOilChangeLogRepositoryStub } = makeSut();
    jest
      .spyOn(addOilChangeLogRepositoryStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(makeAddOilChangeLogModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an OilChangeLog on success", async () => {
    const { sut } = makeSut();
    const log = await sut.add(makeAddOilChangeLogModel());
    expect(log).toEqual(makeFakeOilChangeLog());
  });
});
