import { DbDeleteCity } from "./db-delete-city";
import { DeleteCityRepository } from "../../../protocols/db/city/delete-city";

interface SutTypes {
  sut: DbDeleteCity;
  deleteCityRepositoryStub: DeleteCityRepository;
}

const makeDeleteCityRepository = (): DeleteCityRepository => {
  class DeleteCityRepositoryStub implements DeleteCityRepository {
    async deleteOne(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Cidade Deletada com Sucesso!"));
    }
  }
  return new DeleteCityRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteCityRepositoryStub = makeDeleteCityRepository();
  const sut = new DbDeleteCity(deleteCityRepositoryStub);
  return {
    sut,
    deleteCityRepositoryStub,
  };
};

describe("DbDeleteCity Usecase", () => {
  const id = 1;

  test("Should call DeleteCityRepository with correct values", async () => {
    const { sut, deleteCityRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteCityRepositoryStub, "deleteOne");
    await sut.delete(id);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw if DeleteCityRepository throws", async () => {
    const { sut, deleteCityRepositoryStub } = makeSut();
    jest
      .spyOn(deleteCityRepositoryStub, "deleteOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });

  test("Should return a message on success", async () => {
    const { sut } = makeSut();
    const result = await sut.delete(id);
    expect(result).toEqual("Cidade Deletada com Sucesso!");
  });
});
