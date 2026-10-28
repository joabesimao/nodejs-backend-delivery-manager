import { DeleteNeighborhoodController } from "./delete-neighborhood";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { DeleteNeighborhood } from "../../../../domain/usescases/neighborhood/delete-neighborhood";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: "1",
  },
});

interface SutTypes {
  sut: DeleteNeighborhoodController;
  deleteNeighborhoodStub: DeleteNeighborhood;
}

const makeDeleteNeighborhoodStub = (): DeleteNeighborhood => {
  class DeleteNeighborhoodStub implements DeleteNeighborhood {
    async delete(id: number): Promise<string> {
      return await new Promise((resolve) =>
        resolve("Bairro Deletado com Sucesso!")
      );
    }
  }
  return new DeleteNeighborhoodStub();
};

const makeSut = (): SutTypes => {
  const deleteNeighborhoodStub = makeDeleteNeighborhoodStub();
  const sut = new DeleteNeighborhoodController(deleteNeighborhoodStub);
  return {
    sut,
    deleteNeighborhoodStub,
  };
};

describe("DeleteNeighborhood Controller", () => {
  test("Should call DeleteNeighborhood with correct values", async () => {
    const { sut, deleteNeighborhoodStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteNeighborhoodStub, "delete");
    await sut.handle(makeFakeRequest());
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should return 500 if DeleteNeighborhood throws", async () => {
    const { sut, deleteNeighborhoodStub } = makeSut();
    jest
      .spyOn(deleteNeighborhoodStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok("Bairro Deletado com Sucesso!"));
  });
});
