import { LoadOneRegistersByName } from "../../../../domain/usescases/register/load-one-register";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadRegisterByNameController implements Controller {
  constructor(private readonly loadRegisterByName: LoadOneRegistersByName) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const registerByName = await this.loadRegisterByName.loadByName(
        httpRequest.params.name
      );
      return ok(registerByName);
    } catch (error) {
      return serverError(error);
    }
  }
}
