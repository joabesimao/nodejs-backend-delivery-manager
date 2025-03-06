import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

import { badRequest } from "../../helpers/http/http-helper";
import { MissingParamError } from "../../errors";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const fields = ["password", "email"];
    for (let field of fields) {
      if (!httpRequest.body[field]) {
        return new Promise((resolve) =>
          resolve(badRequest(new MissingParamError(field)))
        );
      }
    }
  }
}
