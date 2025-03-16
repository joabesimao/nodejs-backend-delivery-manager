import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "../protocols/http";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors/access-denied-error";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";
import { AccountModel } from "../../domain/models/account/account-model";
import { MissingParamError } from "../errors";

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

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe("Auth Middleware", () => {
  test("Should return 403 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should call LoadAccountByToken with correct accessToken", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest: HttpRequest = {
      headers: { "x-access-token": "any_token" },
    };
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith("any_token");
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
    const httpRequest: HttpRequest = {
      headers: { "x-access-token": "any_token" },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accountId: 1 }));
  });

  test("Should return 500 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpRequest: HttpRequest = {
      headers: { "x-access-token": "any_token" },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
