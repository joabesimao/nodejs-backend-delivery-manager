import { DbLoadOilChangeConfig } from "./db-load-oil-change-config";
import { LoadOilChangeConfigRepository } from "../../../protocols/db/oil-change/load-oil-change-config";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";

interface SutTypes {
  sut: DbLoadOilChangeConfig;
  loadOilChangeConfigRepositoryStub: LoadOilChangeConfigRepository;
}

const makeFakeConfig = (): OilChangeConfig => ({
  id: 1,
  intervalKm: 800,
  updatedAt: new Date("2026-09-23T00:00:00.000Z"),
});

const makeLoadOilChangeConfigRepositoryStub = (): LoadOilChangeConfigRepository => {
  class LoadOilChangeConfigRepositoryStub implements LoadOilChangeConfigRepository {
    async load(): Promise<OilChangeConfig> {
      return new Promise((resolve) => resolve(makeFakeConfig()));
    }
  }
  return new LoadOilChangeConfigRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadOilChangeConfigRepositoryStub = makeLoadOilChangeConfigRepositoryStub();
  const sut = new DbLoadOilChangeConfig(loadOilChangeConfigRepositoryStub);
  return { sut, loadOilChangeConfigRepositoryStub };
};

describe("DbLoadOilChangeConfig Usecase", () => {
  test("Should call LoadOilChangeConfigRepository", async () => {
    const { sut, loadOilChangeConfigRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadOilChangeConfigRepositoryStub, "load");
    await sut.load();
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should throw if LoadOilChangeConfigRepository throws", async () => {
    const { sut, loadOilChangeConfigRepositoryStub } = makeSut();
    jest
      .spyOn(loadOilChangeConfigRepositoryStub, "load")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a config on success", async () => {
    const { sut } = makeSut();
    const config = await sut.load();
    expect(config).toEqual(makeFakeConfig());
  });
});
