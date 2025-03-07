import { AddAccount } from "../../../domain/usescases/signup/add-account";
import { InvalidParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "../../helpers/validator/validation";

export class SignupController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly emailValidator: EmailValidator,
    private readonly validation: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      const isValid = await this.emailValidator.isValid(email);
      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      const account = await this.addAccount.add({
        name: name,
        email: email,
        password: password,
      });
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
