import { DeleteCityController } from "./delete-city";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { DeleteCity } from "../../../../domain/usescases/city/delete-city";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: "1",
  },
});

interface SutTypes {
  sut: DeleteCityController;
  deleteCityStub: DeleteCity;
}

const makeDeleteCityStub = (): DeleteCity => {
  class DeleteCityStub implements DeleteCity {
    async delete(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Cidade Deletada com Sucesso!"));
    }
  }
  return new DeleteCityStub();
};

const makeSut = (): SutTypes => {
  const deleteCityStub = makeDeleteCityStub();
  const sut = new DeleteCityController(deleteCityStub);
  return {
    sut,
    deleteCityStub,
  };
};

describe("DeleteCity Controller", () => {
  test("Should call DeleteCity with correct values", async () => {
    const { sut, deleteCityStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteCityStub, "delete");
    await sut.handle(makeFakeRequest());
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should return 500 if DeleteCity throws", async () => {
    const { sut, deleteCityStub } = makeSut();
    jest
      .spyOn(deleteCityStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok("Cidade Deletada com Sucesso!"));
  });
});
