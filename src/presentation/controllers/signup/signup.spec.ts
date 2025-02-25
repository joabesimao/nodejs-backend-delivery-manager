import { SignupController } from "./signup";
import { HttpRequest } from "../../protocols/http";
import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http/http-helper";

interface SutTypes {
  sut: SignupController;
}

const makeSut = (): SutTypes => {
  const sut = new SignupController();
  return {
    sut,
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
});
