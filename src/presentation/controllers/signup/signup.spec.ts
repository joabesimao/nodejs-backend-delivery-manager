import { SignupController } from "./signup";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usescases/signup/add-account";
import { HttpRequest } from "../../protocols/http";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";
import { AccountModel } from "../../../domain/models/account/account-model";
import { EmailValidator } from "../../protocols/email-validator";

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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new EmailValidatorStub();
};
interface SutTypes {
  sut: SignupController;
  addAccountStub: AddAccount;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignupController(addAccountStub, emailValidatorStub);
  return {
    sut,
    addAccountStub,
    emailValidatorStub,
  };
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
  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpMissingParamName = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpMissingParamName);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });

  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpMissingParamEmail = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpMissingParamEmail);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpMissingParamEmail = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpMissingParamEmail);

    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  test("Should return 400 if no passwordConfirmation is provided", async () => {
    const { sut } = makeSut();
    const httpMissingParamEmail = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpMissingParamEmail);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("passwordConfirmation"))
    );
  });

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

    expect(httpResponse).toEqual(ok(makeFakeAccountModel()));
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

  test("Should call emailValidator with correct value", async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");

    await sut.handle(makeRequest());
    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should return 400 if passwordConfirmation fails", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "invalid_password",
      },
    });
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError("passwordConfirmation"))
    );
  });

  test("Should return 400 if validator not be valid", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false as any);

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  test("Should return 500 if emailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, "isValid")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
