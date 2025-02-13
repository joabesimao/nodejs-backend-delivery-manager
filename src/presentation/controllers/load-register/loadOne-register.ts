import { LoadOneRegisters } from "../../../domain/usescases/loadRegister/loadOne-register";
import { noContent, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoadOneRegistersController implements Controller {
  constructor(private readonly loadOneRegisters: LoadOneRegisters) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.loadOneRegisters.loadById(httpRequest.body);
      return result ? ok(result) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
