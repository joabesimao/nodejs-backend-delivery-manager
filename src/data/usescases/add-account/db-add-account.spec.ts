import { AccountModel } from "../../../domain/models/account/account-model";
import { AddAccountModel } from "../../../domain/usescases/signup/add-account";
import { Encrypter } from "../../protocols/encrypter/encrypter";
import { DbAddAccount } from "./db-add-account";
import { AddAccountRepository } from "../../../data/protocols/db/account/add-account-repository";
interface SutTypes {
  sut: DbAddAccount;
  encryptStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypt = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
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
        password: "valid_password",
      };
      return new Promise((resolve) => resolve(accountData));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypt();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub);
  return {
    sut,
    encryptStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount Usecase", () => {
  test("Should call Encrypter with correct password", async () => {
    const { sut, encryptStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password",
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw if Encrypter throws", async () => {
    const { sut, encryptStub } = makeSut();
    jest
      .spyOn(encryptStub, "encrypt")
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
});
