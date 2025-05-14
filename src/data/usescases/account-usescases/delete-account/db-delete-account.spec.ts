import { DbDeleteAccountById } from "./db-delete-account";
import { DeleteAccountRepository } from "../../../protocols/db/account/delete-account-repository";

interface SutTypes {
  sut: DbDeleteAccountById;
  deleteAccountByIdRepositoryStub: DeleteAccountRepository;
}

const makeDeleteAccountByIdRepository = (): DeleteAccountRepository => {
  class DeleteAccountByIdRepositoryStub implements DeleteAccountRepository {
    async deleteById(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteAccountByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteAccountByIdRepositoryStub = makeDeleteAccountByIdRepository();
  const sut = new DbDeleteAccountById(deleteAccountByIdRepositoryStub);
  return {
    sut,
    deleteAccountByIdRepositoryStub,
  };
};

describe("DbDeleteAccountById", () => {
  test("Should call DeleteAccountByIdRepository with id correct", async () => {
    const { sut, deleteAccountByIdRepositoryStub } = makeSut();
    const deleteByIdSpy = jest.spyOn(
      deleteAccountByIdRepositoryStub,
      "deleteById"
    );
    await sut.deleteAccountById(1);
    expect(deleteByIdSpy).toHaveBeenCalledWith(1);
  });

  test("Should call DeleteAccountByIdRepository on success", async () => {
    const { sut } = makeSut();
    const deletedRegister = await sut.deleteAccountById(1);
    expect(deletedRegister).toEqual("Deletado com sucesso!");
  });

  test("Should throw if DeleteAccountByIdRepository throws", async () => {
    const { sut, deleteAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(deleteAccountByIdRepositoryStub, "deleteById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.deleteAccountById(1);
    await expect(promise).rejects.toThrow();
  });
});
