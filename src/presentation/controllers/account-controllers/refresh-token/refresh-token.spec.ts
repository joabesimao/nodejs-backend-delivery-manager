import { RefreshTokenController } from "./refresh-token";
import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMySqlRepository } from "../../../../infra/db/mysql/account-repository/account-repository";
import { Validation } from "../../../protocols/validation";
import { HttpRequest } from "../../../protocols/http";
import {
  badRequest,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import { MissingParamError } from "../../../errors";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { env } from "../../../../../config/Env";
import { hashToken } from "../../../../utils/hash-token";

interface SutTypes {
  sut: RefreshTokenController;
  validationStub: Validation;
  jwtAdapter: JwtAdapter;
  accountRepository: AccountMySqlRepository;
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as any;
    }
  }
  return new ValidationStub();
};

const makeFakeAccount = (refreshToken: string): AccountModel => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
  refreshTokenHash: hashToken(refreshToken),
  refreshTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
});

const makeFakeRequest = (refreshToken: string): HttpRequest => ({
  body: { refreshToken },
});

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const accountRepository = new AccountMySqlRepository({} as any);
  jest
    .spyOn(accountRepository, "updateRefreshToken")
    .mockResolvedValue(undefined);
  const sut = new RefreshTokenController(
    validationStub,
    jwtAdapter,
    accountRepository,
    "15m",
    "7d"
  );
  return { sut, validationStub, jwtAdapter, accountRepository };
};

describe("RefreshToken Controller", () => {
  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest("any_token");
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("refreshToken"));
    const httpResponse = await sut.handle(makeFakeRequest("any_token"));
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("refreshToken"))
    );
  });

  test("Should return 401 if refreshToken cannot be decoded", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest("invalid_token"));
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return 401 if decoded token type is not refresh", async () => {
    const { sut, jwtAdapter } = makeSut();
    const accessToken = await jwtAdapter.encrypt("1", { type: "access" });
    const httpResponse = await sut.handle(makeFakeRequest(accessToken));
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return 401 if account is not found", async () => {
    const { sut, jwtAdapter, accountRepository } = makeSut();
    jest
      .spyOn(accountRepository, "loadByToken")
      .mockResolvedValueOnce(null as unknown as AccountModel);
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    const httpResponse = await sut.handle(makeFakeRequest(refreshToken));
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should call accountRepository.loadByToken with correct value", async () => {
    const { sut, jwtAdapter, accountRepository } = makeSut();
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    const loadSpy = jest
      .spyOn(accountRepository, "loadByToken")
      .mockResolvedValueOnce(makeFakeAccount(refreshToken));
    await sut.handle(makeFakeRequest(refreshToken));
    expect(loadSpy).toHaveBeenCalledWith("1");
  });

  test("Should return 401 and revoke the refresh token if the stored hash does not match (reuse of a rotated token)", async () => {
    const { sut, jwtAdapter, accountRepository } = makeSut();
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    jest.spyOn(accountRepository, "loadByToken").mockResolvedValueOnce({
      ...makeFakeAccount(refreshToken),
      refreshTokenHash: "a_different_hash",
    });
    const revokeSpy = jest.spyOn(accountRepository, "updateRefreshToken");
    const httpResponse = await sut.handle(makeFakeRequest(refreshToken));
    expect(httpResponse).toEqual(unauthorized());
    expect(revokeSpy).toHaveBeenCalledWith(1, null, null);
  });

  test("Should return 401 if the stored refresh token has expired", async () => {
    const { sut, jwtAdapter, accountRepository } = makeSut();
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    jest.spyOn(accountRepository, "loadByToken").mockResolvedValueOnce({
      ...makeFakeAccount(refreshToken),
      refreshTokenExpiresAt: new Date(Date.now() - 1000),
    });
    const httpResponse = await sut.handle(makeFakeRequest(refreshToken));
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should return 200 with a new accessToken and refreshToken on success", async () => {
    const { sut, jwtAdapter, accountRepository } = makeSut();
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    jest
      .spyOn(accountRepository, "loadByToken")
      .mockResolvedValueOnce(makeFakeAccount(refreshToken));
    const httpResponse = await sut.handle(makeFakeRequest(refreshToken));
    expect(httpResponse.statusCode).toBe(200);
    expect(typeof httpResponse.body.accessToken).toBe("string");
    expect(typeof httpResponse.body.refreshToken).toBe("string");
  });

  test("Should persist the new rotated refresh token hash on success", async () => {
    const { sut, jwtAdapter, accountRepository } = makeSut();
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    jest
      .spyOn(accountRepository, "loadByToken")
      .mockResolvedValueOnce(makeFakeAccount(refreshToken));
    const updateSpy = jest.spyOn(accountRepository, "updateRefreshToken");
    const httpResponse = await sut.handle(makeFakeRequest(refreshToken));
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      hashToken(httpResponse.body.refreshToken),
      expect.any(Date)
    );
  });

  test("Should return 500 if jwtAdapter.decode throws", async () => {
    const { sut, jwtAdapter } = makeSut();
    jest.spyOn(jwtAdapter, "decode").mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest("any_token"));
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
