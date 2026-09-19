import { LoginController } from "./login";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import { MissingParamError } from "../../../errors";
import {
  Authentication,
  AuthenticationModel,
} from "../../../../domain/usescases/authentication/authentication";
import { Validation } from "../../../protocols/validation";
import { JwtAdapter } from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { env } from "../../../../../config/Env";

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return "any_token";
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as unknown as any;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);
  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe("Login Controller", () => {
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

  test("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(null as any)));
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized());
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

  test("Should return 200 if valid credentials are provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validationSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    await sut.handle(httpRequest);
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 500 if Validation return an Error", async () => {
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, "validate")
      .mockReturnValueOnce(new MissingParamError("any_field"));
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError("any_field"))
    );
  });

  test("Should return 200 with accessToken and refreshToken when the accessToken payload contains an id", async () => {
    const { sut, authenticationStub } = makeSut();
    const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
    const validAccessToken = await jwtAdapter.encrypt("1", {
      type: "access",
    });
    jest
      .spyOn(authenticationStub, "auth")
      .mockReturnValueOnce(new Promise((resolve) => resolve(validAccessToken)));
    const httpRequest = {
      body: {
        email: "any_email@email.com",
        password: "any_password",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toBe(validAccessToken);
    expect(typeof httpResponse.body.refreshToken).toBe("string");
    const refreshPayload = await jwtAdapter.decode(
      httpResponse.body.refreshToken
    );
    expect(refreshPayload.type).toBe("refresh");
    expect(refreshPayload.id).toBe("1");
  });
});
