import { DbLoadOilChangeLog } from "./db-load-oil-change-log";
import { LoadOilChangeLogRepository } from "../../../protocols/db/oil-change/load-oil-change-log";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";

interface SutTypes {
  sut: DbLoadOilChangeLog;
  loadOilChangeLogRepositoryStub: LoadOilChangeLogRepository;
}

const makeFakeLogs = (): OilChangeLog[] => [
  {
    id: 1,
    vehicleId: 1,
    deliverymanId: 1,
    km: 1000,
    nextChangeKm: 1800,
    changeDate: new Date("2026-09-23T00:00:00.000Z"),
    createdAt: new Date("2026-09-23T00:00:00.000Z"),
  },
];

const makeLoadOilChangeLogRepositoryStub = (): LoadOilChangeLogRepository => {
  class LoadOilChangeLogRepositoryStub implements LoadOilChangeLogRepository {
    async loadAll(params?: any): Promise<OilChangeLog[]> {
      return new Promise((resolve) => resolve(makeFakeLogs()));
    }
  }
  return new LoadOilChangeLogRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadOilChangeLogRepositoryStub = makeLoadOilChangeLogRepositoryStub();
  const sut = new DbLoadOilChangeLog(loadOilChangeLogRepositoryStub);
  return { sut, loadOilChangeLogRepositoryStub };
};

describe("DbLoadOilChangeLog Usecase", () => {
  test("Should call LoadOilChangeLogRepository with correct params", async () => {
    const { sut, loadOilChangeLogRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadOilChangeLogRepositoryStub, "loadAll");
    await sut.load({ vehicleId: 1 });
    expect(loadSpy).toHaveBeenCalledWith({ vehicleId: 1 });
  });

  test("Should throw if LoadOilChangeLogRepository throws", async () => {
    const { sut, loadOilChangeLogRepositoryStub } = makeSut();
    jest
      .spyOn(loadOilChangeLogRepositoryStub, "loadAll")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of logs on success", async () => {
    const { sut } = makeSut();
    const logs = await sut.load();
    expect(logs).toEqual(makeFakeLogs());
  });
});
