import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "../protocols/http";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors/access-denied-error";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";
import { AccountModel } from "../../domain/models/account/account-model";

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(
      accessToken: string,
      role?: string | undefined
    ): Promise<AccountModel> {
      const account: AccountModel = {
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      };
      return new Promise((resolve) => resolve(account));
    }
  }
  return new LoadAccountByTokenStub();
};

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: { "x-access-token": "any_token" },
});

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return 403 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return account on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(ok({ accountId: 1 }));
  });

  test("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call LoadAccountByToken with correct accessToken and role", async () => {
    const role = "any_role";
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    await sut.handle(makeFakeHttpRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token", role);
  });
});
