import { AddStaffAccountController } from "./add-staff-account";
import {
  AddAccount,
  AddAccountModel,
} from "../../../../domain/usescases/signup/add-account";
import { HttpRequest } from "../../../protocols/http";
import { EmailInUseError, MissingParamError } from "../../../errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { Validation } from "../../../protocols/validation";

const makeFakeAccountModel = (): AccountModel => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  password: "hashed_password",
  role: "entregador" as any,
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccountModel()));
    }
  }
  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as any;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: AddStaffAccountController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new AddStaffAccountController(addAccountStub, validationStub);
  return { sut, addAccountStub, validationStub };
};

const makeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
    role: "entregador",
  },
});

describe("AddStaffAccount Controller", () => {
  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeRequest();
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if Validation returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("role"));
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("role")));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const spy = jest.spyOn(addAccountStub, "add");
    await sut.handle(makeRequest());
    expect(spy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
      role: "entregador",
    });
  });

  test("Should return 403 if AddAccount returns null (email in use)", async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test("Should return 200 with the created account (no password or token leaked)", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(
      ok({
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        role: "entregador",
      })
    );
  });

  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
