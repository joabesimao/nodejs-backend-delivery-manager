import { DbDeleteNeighborhood } from "./db-delete-neighborhood";
import { DeleteNeighborhoodRepository } from "../../../protocols/db/neighborhood/delete-neighborhood";

interface SutTypes {
  sut: DbDeleteNeighborhood;
  deleteNeighborhoodRepositoryStub: DeleteNeighborhoodRepository;
}

const makeDeleteNeighborhoodRepository = (): DeleteNeighborhoodRepository => {
  class DeleteNeighborhoodRepositoryStub
    implements DeleteNeighborhoodRepository {
    async deleteOne(id: number): Promise<string> {
      return await new Promise((resolve) =>
        resolve("Bairro Deletado com Sucesso!")
      );
    }
  }
  return new DeleteNeighborhoodRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteNeighborhoodRepositoryStub = makeDeleteNeighborhoodRepository();
  const sut = new DbDeleteNeighborhood(deleteNeighborhoodRepositoryStub);
  return {
    sut,
    deleteNeighborhoodRepositoryStub,
  };
};

describe("DbDeleteNeighborhood Usecase", () => {
  const id = 1;

  test("Should call DeleteNeighborhoodRepository with correct values", async () => {
    const { sut, deleteNeighborhoodRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(
      deleteNeighborhoodRepositoryStub,
      "deleteOne"
    );
    await sut.delete(id);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw if DeleteNeighborhoodRepository throws", async () => {
    const { sut, deleteNeighborhoodRepositoryStub } = makeSut();
    jest
      .spyOn(deleteNeighborhoodRepositoryStub, "deleteOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });

  test("Should return a message on success", async () => {
    const { sut } = makeSut();
    const result = await sut.delete(id);
    expect(result).toEqual("Bairro Deletado com Sucesso!");
  });
});
