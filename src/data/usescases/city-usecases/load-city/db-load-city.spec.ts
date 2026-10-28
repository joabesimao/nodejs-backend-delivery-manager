import { DbLoadCity } from "./db-load-city";
import { LoadCityRepository } from "../../../protocols/db/city/load-city";
import { City } from "../../../../domain/models/city/city-model";

const makeFakeCityList = (): City[] => [
  {
    id: 1,
    name: "any_name",
  },
  {
    id: 2,
    name: "other_name",
  },
];

interface SutTypes {
  sut: DbLoadCity;
  loadCityRepositoryStub: LoadCityRepository;
}

const makeLoadCityRepository = (): LoadCityRepository => {
  class LoadCityRepositoryStub implements LoadCityRepository {
    async loadAll(): Promise<City[]> {
      return await new Promise((resolve) => resolve(makeFakeCityList()));
    }
  }
  return new LoadCityRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadCityRepositoryStub = makeLoadCityRepository();
  const sut = new DbLoadCity(loadCityRepositoryStub);
  return {
    sut,
    loadCityRepositoryStub,
  };
};

describe("DbLoadCity Usecase", () => {
  test("Should call LoadCityRepository", async () => {
    const { sut, loadCityRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadCityRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should throw if LoadCityRepository throws", async () => {
    const { sut, loadCityRepositoryStub } = makeSut();
    jest
      .spyOn(loadCityRepositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of City on success", async () => {
    const { sut } = makeSut();
    const cities = await sut.load();
    expect(cities).toEqual(makeFakeCityList());
  });
});
