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

const makeFakeAccount = (): AccountModel => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

const makeFakeRequest = (refreshToken: string): HttpRequest => ({
  body: { refreshToken },
});

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const accountRepository = new AccountMySqlRepository({} as any);
  jest
    .spyOn(accountRepository, "loadByToken")
    .mockResolvedValue(makeFakeAccount());
  const sut = new RefreshTokenController(
    validationStub,
    jwtAdapter,
    accountRepository
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
    const loadSpy = jest.spyOn(accountRepository, "loadByToken");
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    await sut.handle(makeFakeRequest(refreshToken));
    expect(loadSpy).toHaveBeenCalledWith("1");
  });

  test("Should return 200 with a new accessToken and refreshToken on success", async () => {
    const { sut, jwtAdapter } = makeSut();
    const refreshToken = await jwtAdapter.encrypt("1", { type: "refresh" });
    const httpResponse = await sut.handle(makeFakeRequest(refreshToken));
    expect(httpResponse.statusCode).toBe(200);
    expect(typeof httpResponse.body.accessToken).toBe("string");
    expect(typeof httpResponse.body.refreshToken).toBe("string");
  });

  test("Should return 500 if jwtAdapter.decode throws", async () => {
    const { sut, jwtAdapter } = makeSut();
    jest.spyOn(jwtAdapter, "decode").mockRejectedValueOnce(new Error());
    const httpResponse = await sut.handle(makeFakeRequest("any_token"));
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
