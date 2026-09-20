import { DbDeleteAccountById } from "./db-delete-account";
import { DeleteAccountRepository } from "../../../protocols/db/account/delete-account-repository";
import { LoadAccountByIdRepository } from "../../../protocols/db/account/load-account-by-id-repository";
import { CountActiveAdminsRepository } from "../../../protocols/db/account/count-active-admins-repository";
import { PublicAccountModel } from "../../../../domain/models/account/public-account-model";
import { SelfActionError } from "../../../../presentation/errors/self-action-error";
import { LastAdminError } from "../../../../presentation/errors/last-admin-error";

interface SutTypes {
  sut: DbDeleteAccountById;
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository;
  countActiveAdminsRepositoryStub: CountActiveAdminsRepository;
  deleteAccountByIdRepositoryStub: DeleteAccountRepository;
}

const fakeTargetAccount = (): PublicAccountModel => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  role: "user",
  active: true,
  unitStoreId: null,
});

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById(id: number): Promise<PublicAccountModel | null> {
      return fakeTargetAccount();
    }
  }
  return new LoadAccountByIdRepositoryStub();
};

const makeCountActiveAdminsRepository = (): CountActiveAdminsRepository => {
  class CountActiveAdminsRepositoryStub implements CountActiveAdminsRepository {
    async countActiveAdmins(): Promise<number> {
      return 2;
    }
  }
  return new CountActiveAdminsRepositoryStub();
};

const makeDeleteAccountByIdRepository = (): DeleteAccountRepository => {
  class DeleteAccountByIdRepositoryStub implements DeleteAccountRepository {
    async deleteById(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteAccountByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository();
  const countActiveAdminsRepositoryStub = makeCountActiveAdminsRepository();
  const deleteAccountByIdRepositoryStub = makeDeleteAccountByIdRepository();
  const sut = new DbDeleteAccountById(
    loadAccountByIdRepositoryStub,
    countActiveAdminsRepositoryStub,
    deleteAccountByIdRepositoryStub,
  );
  return {
    sut,
    loadAccountByIdRepositoryStub,
    countActiveAdminsRepositoryStub,
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
    await sut.deleteAccountById(1, 999);
    expect(deleteByIdSpy).toHaveBeenCalledWith(1);
  });

  test("Should call DeleteAccountByIdRepository on success", async () => {
    const { sut } = makeSut();
    const deletedRegister = await sut.deleteAccountById(1, 999);
    expect(deletedRegister).toEqual("Deletado com sucesso!");
  });

  test("Should throw if DeleteAccountByIdRepository throws", async () => {
    const { sut, deleteAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(deleteAccountByIdRepositoryStub, "deleteById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.deleteAccountById(1, 999);
    await expect(promise).rejects.toThrow();
  });

  test("Should throw SelfActionError if requester tries to delete their own account", async () => {
    const { sut } = makeSut();
    const promise = sut.deleteAccountById(1, 1);
    await expect(promise).rejects.toThrow(new SelfActionError());
  });

  test("Should throw LastAdminError when deleting the last active admin", async () => {
    const { sut, loadAccountByIdRepositoryStub, countActiveAdminsRepositoryStub } =
      makeSut();
    jest
      .spyOn(loadAccountByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(
        Promise.resolve({ ...fakeTargetAccount(), role: "admin" }),
      );
    jest
      .spyOn(countActiveAdminsRepositoryStub, "countActiveAdmins")
      .mockReturnValueOnce(Promise.resolve(1));

    const promise = sut.deleteAccountById(1, 999);
    await expect(promise).rejects.toThrow(new LastAdminError());
  });

  test("Should allow deleting an admin when there are other active admins", async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByIdRepositoryStub, "loadById")
      .mockReturnValueOnce(
        Promise.resolve({ ...fakeTargetAccount(), role: "admin" }),
      );

    const result = await sut.deleteAccountById(1, 999);
    expect(result).toEqual("Deletado com sucesso!");
  });
});
