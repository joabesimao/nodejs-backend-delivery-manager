import { AddAccount } from "../../../domain/usescases/signup/add-account";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { EmailValidator } from "../../protocols/email-validator";

export class SignupController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly emailValidator: EmailValidator
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      const requireFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = await this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const account = await this.addAccount.add({
        name: name,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
      });
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
