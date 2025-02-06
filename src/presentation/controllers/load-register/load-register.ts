import { LoadRegisters } from "../../../domain/usescases/loadRegister/load-register";
import { ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoadRegistersController implements Controller {
  constructor(private readonly loadRegister: LoadRegisters) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const registers = await this.loadRegister.load();
      return ok(registers);
    } catch (error) {
      return serverError(error);
    }
  }
}

