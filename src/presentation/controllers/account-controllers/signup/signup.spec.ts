import { SignupController } from "./signup";
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
import {
  Authentication,
  AuthenticationModel,
} from "../../../../domain/usescases/authentication/authentication";

const makeFakeAccountModel = (): AccountModel => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
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
  sut: SignupController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const authenticationStub = makeAuthenticationStub();
  const validationStub = makeValidation();
  const sut = new SignupController(
    addAccountStub,
    validationStub,
    authenticationStub
  );
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return "any_token";
    }
  }
  return new AuthenticationStub();
};

const makeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

describe("Signup Controller", () => {
  test("Should call addAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const spy = jest.spyOn(addAccountStub, "add");

    await sut.handle(makeRequest());

    expect(spy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  test("Should return 500 if addAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeRequest();
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 500 if Validation return an Error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  test("Should call Authentication with correct values", async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith({
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test("Should return 500 if Authentication throws", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(
        new Promise((resolve, rejects) => rejects(new Error()))
      );
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 403 if AddAccount returns null", async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, "add")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const httpResponse = await sut.handle(makeRequest());

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });
});
