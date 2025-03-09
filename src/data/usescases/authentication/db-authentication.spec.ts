import { DbAuthentication } from "./db-authentication";
import { AccountModel } from "../../../domain/models/account/account-model";
import { LoadAccountByEmailRepository } from "../../../data/protocols/authentication/load-account-by-email-repository";

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 1,
          name: "any_name",
          email: "any_email@email.com",
          password: "any_password",
        };
        return new Promise((resolve) => resolve(account));
      }
    }
    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");
    sut.auth({
      email: "any_email@email.com",
      password: "any_password",
    });
    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
