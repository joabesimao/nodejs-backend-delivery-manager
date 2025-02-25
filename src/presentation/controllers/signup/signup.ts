import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class SignupController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirmation } = httpRequest.body;
    const requireFields = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
    return null;
  }
}
