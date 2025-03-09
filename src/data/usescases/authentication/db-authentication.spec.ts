import { DbAuthentication } from "./db-authentication";
import { AccountModel } from "../../../domain/models/account/account-model";
import { LoadAccountByEmailRepository } from "../../../data/protocols/authentication/load-account-by-email-repository";

const fakeAccount = () => {
  const account: AccountModel = {
    id: 1,
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
  };
  return account;
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(fakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    await sut.auth(fakeAccount());
    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw if LoadAccountByEmailRepository throws ", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest
      .spyOn(loadAccountByEmailRepositoryStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(fakeAccount());
    await expect(promise).rejects.toThrow();
  });
});
