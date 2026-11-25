import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from "../../../helpers/http/http-helper";
import {
  InvalidCredentialsError,
  InvalidLoginInputError,
} from "../../../errors";
import { Authentication } from "../../../../domain/usecases/authentication/authentication";
import { Validation } from "../../../protocols/validation";

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(new InvalidLoginInputError());
      }
      const { email, password } = httpRequest.body;

      const authResult = await this.authentication.auth({ email, password });
      if (!authResult) {
        return unauthorized(new InvalidCredentialsError());
      }

      return ok(authResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
