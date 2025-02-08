import { LoadOneRegisters } from "../../../domain/usescases/loadRegister/loadOne-register";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoadOneRegistersController implements Controller {
  constructor(private readonly loadOneRegisters: LoadOneRegisters) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const result = await this.loadOneRegisters.loadById(httpRequest.body.id);
    return ok(result);
  }
}
