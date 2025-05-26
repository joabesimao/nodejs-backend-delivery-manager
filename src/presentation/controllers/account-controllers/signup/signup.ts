import { Authentication } from "../../../../domain/usescases/authentication/authentication";
import { AddAccount } from "../../../../domain/usescases/signup/add-account";
import { EmailInUseError } from "../../../errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";
export class SignupController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password } = httpRequest.body;

      const account = await this.addAccount.add({
        name: name,
        email: email,
        password: password,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }
      const accessToken = await this.authentication.auth({ email, password });
      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
