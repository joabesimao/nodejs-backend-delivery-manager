import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { EmailValidator } from "../../protocols/email-validator";
import { badRequest, serverError } from "../../helpers/http/http-helper";
import { InvalidParamError, MissingParamError } from "../../errors";
import { Authentication } from "../../../domain/usescases/authentication/authentication";

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      const fields = ["password", "email"];
      for (let field of fields) {
        if (!httpRequest.body[field]) {
          return new Promise((resolve) =>
            resolve(badRequest(new MissingParamError(field)))
          );
        }
      }
      const isValid = await this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      await this.authentication.auth(email, password);
    } catch (error) {
      return serverError(error);
    }
  }
}
