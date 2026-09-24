import { DbUpdateOilChangeConfig } from "./db-update-oil-change-config";
import { UpdateOilChangeConfigRepository } from "../../../protocols/db/oil-change/update-oil-change-config";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";

interface SutTypes {
  sut: DbUpdateOilChangeConfig;
  updateOilChangeConfigRepositoryStub: UpdateOilChangeConfigRepository;
}

const makeFakeConfig = (): OilChangeConfig => ({
  id: 1,
  intervalKm: 1000,
  updatedAt: new Date("2026-09-23T00:00:00.000Z"),
});

const makeUpdateOilChangeConfigRepositoryStub = (): UpdateOilChangeConfigRepository => {
  class UpdateOilChangeConfigRepositoryStub implements UpdateOilChangeConfigRepository {
    async upsert(intervalKm: number): Promise<OilChangeConfig> {
      return new Promise((resolve) => resolve(makeFakeConfig()));
    }
  }
  return new UpdateOilChangeConfigRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateOilChangeConfigRepositoryStub = makeUpdateOilChangeConfigRepositoryStub();
  const sut = new DbUpdateOilChangeConfig(updateOilChangeConfigRepositoryStub);
  return { sut, updateOilChangeConfigRepositoryStub };
};

describe("DbUpdateOilChangeConfig Usecase", () => {
  test("Should call UpdateOilChangeConfigRepository with correct intervalKm", async () => {
    const { sut, updateOilChangeConfigRepositoryStub } = makeSut();
    const upsertSpy = jest.spyOn(updateOilChangeConfigRepositoryStub, "upsert");
    await sut.update({ intervalKm: 1000 });
    expect(upsertSpy).toHaveBeenCalledWith(1000);
  });

  test("Should throw if UpdateOilChangeConfigRepository throws", async () => {
    const { sut, updateOilChangeConfigRepositoryStub } = makeSut();
    jest
      .spyOn(updateOilChangeConfigRepositoryStub, "upsert")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.update({ intervalKm: 1000 });
    await expect(promise).rejects.toThrow();
  });

  test("Should return a config on success", async () => {
    const { sut } = makeSut();
    const config = await sut.update({ intervalKm: 1000 });
    expect(config).toEqual(makeFakeConfig());
  });
});
