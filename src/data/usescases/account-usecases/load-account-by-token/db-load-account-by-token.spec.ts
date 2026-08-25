import { DbLoadAccountByToken } from "./db-load-account-by-token";
import { Decrypter } from "../../../protocols/criptography/decrypter";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/load-account-by-token-repository";

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository;
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("any_value"));
    }
  }
  return new DecrypterStub();
};

const makeLoadAccountByTokenRepositoryStub =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      async loadByToken(token: string, role?: string): Promise<AccountModel> {
        return new Promise((resolve) =>
          resolve({
            id: 1,
            name: "valid_name",
            email: "valid_email",
            password: "hashed_password",
          })
        );
      }
    }
    return new LoadAccountByTokenRepositoryStub();
  };

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByTokenRepositoryStub =
    makeLoadAccountByTokenRepositoryStub();
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  );
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  };
};

describe("DbLoadAccountByToken", () => {
  test("Should call Decrypter with correct values", async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token");
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });

  test("Should return null if Decrypter return null", async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const result = await sut.load("any_token");
    expect(result).toBeNull();
  });

  test("Should call LoadAccountByTokenRepository with correct values", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadAccountByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      "loadByToken"
    );
    await sut.load("any_token", "any_role");
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith("any_value", "any_role");
  });

  test("Should return null if LoadAccountByTokenRepository return null", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const result = await sut.load("any_token");
    expect(result).toBeNull();
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();

    const account = await sut.load("any_token");
    expect(account).toEqual({
      id: 1,
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Should throw if Decrypter throws", async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, "decrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load("any_token", "any_role");
    await expect(promise).rejects.toThrow();
  });

  test("Should throw if LoadAccountByTokenRepository throws", async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenRepositoryStub, "loadByToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load("any_token", "any_role");
    await expect(promise).rejects.toThrow();
  });
});
