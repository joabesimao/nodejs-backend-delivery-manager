import { DbAddCity } from "./db-add-city";
import { AddCityRepository } from "../../../protocols/db/city/add-city";
import { City } from "../../../../domain/models/city/city-model";
import { AddCityModel } from "../../../../domain/usescases/city/add-city";

interface SutTypes {
  sut: DbAddCity;
  addCityRepositoryStub: AddCityRepository;
}

const makeCity = (): City => ({
  id: 1,
  name: "any_name",
});

const makeAddCityModel = (): AddCityModel => ({
  name: "any_name",
});

const makeAddCityRepository = (): AddCityRepository => {
  class AddCityRepositoryStub implements AddCityRepository {
    async add(city: AddCityModel): Promise<City> {
      return await new Promise((resolve) => resolve(makeCity()));
    }
  }
  return new AddCityRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addCityRepositoryStub = makeAddCityRepository();
  const sut = new DbAddCity(addCityRepositoryStub);
  return {
    sut,
    addCityRepositoryStub,
  };
};

describe("DbAddCity Usecase", () => {
  test("Should call AddCityRepository with correct values", async () => {
    const { sut, addCityRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCityRepositoryStub, "add");
    await sut.add(makeAddCityModel());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
    });
  });

  test("Should throw if AddCityRepository throws", async () => {
    const { sut, addCityRepositoryStub } = makeSut();
    jest
      .spyOn(addCityRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeAddCityModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return a City on success", async () => {
    const { sut } = makeSut();
    const city = await sut.add(makeAddCityModel());
    expect(city).toEqual(makeCity());
  });
});
