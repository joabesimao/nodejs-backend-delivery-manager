import { AccountModel } from "../../../../domain/models/account/account-model";
import { AddAccountModel } from "../../../../domain/usescases/signup/add-account";
import { Hasher } from "../../../protocols/criptography/hasher";
import { DbAddAccount } from "./db-add-account";
import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { FindAccountByEmailRepository } from "../../../../data/protocols/db/account/find-account-by-email-repository";
interface SutTypes {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountRepositoryStub: FindAccountByEmailRepository;
}

const makeEncrypt = (): Hasher => {
  class EncryptStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncryptStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const accountData = {
        id: 1,
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      };
      return new Promise((resolve) => resolve(accountData));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeLoadAccountRepository = (): FindAccountByEmailRepository => {
  class LoadAccountRepositoryByIdStub implements FindAccountByEmailRepository {
    async loadAccountByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(null as any));
    }
  }
  return new LoadAccountRepositoryByIdStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeEncrypt();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountRepositoryStub = makeLoadAccountRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountRepositoryStub
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const encryptSpy = jest.spyOn(hasherStub, "hash");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw if Hasher throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error("")))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddAccountRepository with correct values", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Should throw if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error("")))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();

    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: 1,
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountRepositoryStub } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    const loadSpy = jest.spyOn(loadAccountRepositoryStub, "loadAccountByEmail");
    const account = await sut.add(accountData);
    expect(loadSpy).toHaveBeenCalledWith("valid_email");
  });

  test("Should return null if LoadAccountByEmailRepository not return null", async () => {
    const { sut, loadAccountRepositoryStub } = makeSut();
    const accountData = {
      id: 1,
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    jest
      .spyOn(loadAccountRepositoryStub, "loadAccountByEmail")
      .mockReturnValueOnce(new Promise((resolve) => resolve(accountData)));
    const account = await sut.add(accountData);
    expect(account).toBeNull();
  });
});
