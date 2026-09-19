import { AuthMiddleware } from "./auth-middleware";
import { HttpRequest } from "../protocols/http";
import { forbidden, ok, unauthorized } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors/access-denied-error";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";
import { AccountModel } from "../../domain/models/account/account-model";

const makeFakeAccount = (): AccountModel => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
  role: "user" as any,
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (roles?: string[]): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, roles);
  return {
    sut,
    loadAccountByTokenStub,
  };
};

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: { "x-access-token": "any_token" },
});

describe("Auth Middleware", () => {
  test("Should return 401 if no x-access-token exists in headers", async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {},
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return 401 if LoadAccountByToken returns null", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return account on success when no roles are required", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(
      ok({ accountId: 1, accountRole: "user", accountUnitStoreId: null })
    );
  });

  test("Should return account on success when account role is in the allowed roles", async () => {
    const { sut } = makeSut(["admin", "user"]);

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(
      ok({ accountId: 1, accountRole: "user", accountUnitStoreId: null })
    );
  });

  test("Should return 403 if account role is not in the allowed roles", async () => {
    const { sut } = makeSut(["admin"]);

    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("Should return 401 if LoadAccountByToken throws", async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, "load")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeHttpRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should call LoadAccountByToken with the correct accessToken", async () => {
    const { sut, loadAccountByTokenStub } = makeSut(["admin"]);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    await sut.handle(makeFakeHttpRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});
