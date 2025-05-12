import { DeleteRegisterByIdRepository } from "../../../protocols/db/register/delete-register-repository";
import { DbDeleteRegisterById } from "./db-delete-register";
interface SutTypes {
  sut: DbDeleteRegisterById;
  deleteRegisterByIdRepositoryStub: DeleteRegisterByIdRepository;
}
const makeDeleteRegisterByIdRepository = (): DeleteRegisterByIdRepository => {
  class DeleteRegisterByIdRepositoryStub
    implements DeleteRegisterByIdRepository
  {
    async deleteById(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteRegisterByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteRegisterByIdRepositoryStub = makeDeleteRegisterByIdRepository();
  const sut = new DbDeleteRegisterById(deleteRegisterByIdRepositoryStub);
  return {
    sut,
    deleteRegisterByIdRepositoryStub,
  };
};
describe("DbDeleteRegistersById", () => {
  test("Should call DeleteRegisterByIdRepository with id correct", async () => {
    const { sut, deleteRegisterByIdRepositoryStub } = makeSut();
    const deleteByIdSpy = jest.spyOn(
      deleteRegisterByIdRepositoryStub,
      "deleteById"
    );
    await sut.delete(1);
    expect(deleteByIdSpy).toHaveBeenCalledWith(1);
  });

  test("Should call DeleteRegisterByIdRepository", async () => {
    const { sut, deleteRegisterByIdRepositoryStub } = makeSut();
    const deleteByIdSpy = jest.spyOn(
      deleteRegisterByIdRepositoryStub,
      "deleteById"
    );
    await sut.delete(1);
    expect(deleteByIdSpy).toHaveBeenCalled();
  });

  test("Should call DeleteRegisterByIdRepository on success", async () => {
    const { sut } = makeSut();

    const deletedRegister = await sut.delete(1);
    expect(deletedRegister).toEqual("Deletado com sucesso!");
  });

  test("Should throw if DeleteRegisterByIdRepository throws", async () => {
    const { sut, deleteRegisterByIdRepositoryStub } = makeSut();
    jest
      .spyOn(deleteRegisterByIdRepositoryStub, "deleteById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(1);
    await expect(promise).rejects.toThrow();
  });
});
