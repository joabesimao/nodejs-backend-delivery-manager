import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { EmailValidator } from "../../protocols/email-validator";
import { badRequest } from "../../helpers/http/http-helper";
import { MissingParamError } from "../../errors";

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body;
    const fields = ["password", "email"];
    for (let field of fields) {
      if (!httpRequest.body[field]) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParamError(field)))
        );
      }
    }
    await this.emailValidator.isValid(email);
  }
}
