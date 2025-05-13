import { LoadOneRegisters } from "../../../../domain/usescases/register/load-one-register";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOneRegistersController implements Controller {
  constructor(private readonly loadOneRegisters: LoadOneRegisters) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.loadOneRegisters.loadById(
        httpRequest.params.id
      );
      return result ? ok(result) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
