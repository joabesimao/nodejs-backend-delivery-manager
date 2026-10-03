import { DbAddOilChangeLog } from "./db-add-oil-change-log";
import { AddOilChangeLogRepository } from "../../../protocols/db/oil-change/add-oil-change-log";
import { LoadOilChangeLogRepository } from "../../../protocols/db/oil-change/load-oil-change-log";
import { LoadOilChangeConfigRepository } from "../../../protocols/db/oil-change/load-oil-change-config";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { KM_OUT_OF_ORDER_MESSAGE } from "../../../helpers/km-sequence";
import { InvalidKmError } from "../../../../presentation/errors";

interface SutTypes {
  sut: DbAddOilChangeLog;
  loadOilChangeConfigRepositoryStub: LoadOilChangeConfigRepository;
  loadOilChangeLogRepositoryStub: LoadOilChangeLogRepository;
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

const makeExisting = (id: number, km: number, date: string): OilChangeLog => ({
  ...makeFakeOilChangeLog(),
  id,
  km,
  changeDate: new Date(date),
});

const makeLoadOilChangeLogRepositoryStub = (): LoadOilChangeLogRepository => {
  class LoadOilChangeLogRepositoryStub implements LoadOilChangeLogRepository {
    async loadAll(): Promise<OilChangeLog[]> {
      return await new Promise((resolve) => resolve([]));
    }
  }
  return new LoadOilChangeLogRepositoryStub();
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
  const loadOilChangeLogRepositoryStub = makeLoadOilChangeLogRepositoryStub();
  const addOilChangeLogRepositoryStub = makeAddOilChangeLogRepositoryStub();
  const sut = new DbAddOilChangeLog(
    loadOilChangeConfigRepositoryStub,
    loadOilChangeLogRepositoryStub,
    addOilChangeLogRepositoryStub
  );
  return {
    sut,
    loadOilChangeConfigRepositoryStub,
    loadOilChangeLogRepositoryStub,
    addOilChangeLogRepositoryStub,
  };
};

describe("DbAddOilChangeLog Usecase", () => {
  test("Should load the logs of the same vehicle", async () => {
    const { sut, loadOilChangeLogRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadOilChangeLogRepositoryStub, "loadAll");
    await sut.add(makeAddOilChangeLogModel());
    expect(loadSpy).toHaveBeenCalledWith({ vehicleId: 1 });
  });

  test("Should throw the default InvalidKmError if km is not greater than the last log", async () => {
    const { sut, loadOilChangeLogRepositoryStub } = makeSut();
    jest.spyOn(loadOilChangeLogRepositoryStub, "loadAll").mockResolvedValueOnce([makeExisting(5, 1000, "2026-09-20")]);
    const promise = sut.add(makeAddOilChangeLogModel());
    await expect(promise).rejects.toEqual(new InvalidKmError());
  });

  test("Should throw an out-of-order InvalidKmError if a backdated km is not lower than the next log", async () => {
    const { sut, loadOilChangeLogRepositoryStub } = makeSut();
    jest
      .spyOn(loadOilChangeLogRepositoryStub, "loadAll")
      .mockResolvedValueOnce([makeExisting(6, 1000, "2026-09-30"), makeExisting(5, 800, "2026-09-10")]);
    const promise = sut.add(makeAddOilChangeLogModel());
    await expect(promise).rejects.toEqual(new InvalidKmError(KM_OUT_OF_ORDER_MESSAGE));
  });

  test("Should accept a backdated log that fits between its neighbors", async () => {
    const { sut, loadOilChangeLogRepositoryStub, addOilChangeLogRepositoryStub } = makeSut();
    jest
      .spyOn(loadOilChangeLogRepositoryStub, "loadAll")
      .mockResolvedValueOnce([makeExisting(6, 1500, "2026-09-30"), makeExisting(5, 800, "2026-09-10")]);
    const addSpy = jest.spyOn(addOilChangeLogRepositoryStub, "add");
    await sut.add(makeAddOilChangeLogModel());
    expect(addSpy).toHaveBeenCalled();
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
