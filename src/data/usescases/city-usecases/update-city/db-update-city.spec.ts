import { DbUpdateCity } from "./db-update-city";
import { UpdateCityRepository } from "../../../protocols/db/city/update-city";
import { City } from "../../../../domain/models/city/city-model";
import { UpdateCityModel } from "../../../../domain/usescases/city/update-city";

const makeFakeCity = (): City => ({
  id: 1,
  name: "any_name",
});

interface SutTypes {
  sut: DbUpdateCity;
  updateCityRepositoryStub: UpdateCityRepository;
}

const makeUpdateCityRepository = (): UpdateCityRepository => {
  class UpdateCityRepositoryStub implements UpdateCityRepository {
    async update(id: number, data: Partial<City>): Promise<City> {
      return new Promise((resolve) => resolve(makeFakeCity()));
    }
  }
  return new UpdateCityRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateCityRepositoryStub = makeUpdateCityRepository();
  const sut = new DbUpdateCity(updateCityRepositoryStub);
  return {
    sut,
    updateCityRepositoryStub,
  };
};

describe("DbUpdateCity Usecase", () => {
  const id = 1;
  const data: UpdateCityModel = { name: "any_name" };

  test("Should call UpdateCityRepository with correct values", async () => {
    const { sut, updateCityRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateCityRepositoryStub, "update");
    await sut.update(id, data);
    expect(updateSpy).toHaveBeenCalledWith(1, { name: "any_name" });
  });

  test("Should throw if UpdateCityRepository throws", async () => {
    const { sut, updateCityRepositoryStub } = makeSut();
    jest
      .spyOn(updateCityRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(id, data);
    await expect(promise).rejects.toThrow();
  });

  test("Should return a City on success", async () => {
    const { sut } = makeSut();
    const city = await sut.update(id, data);
    expect(city).toEqual(makeFakeCity());
  });
});
