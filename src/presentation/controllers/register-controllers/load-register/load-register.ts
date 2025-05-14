import { LoadRegisters } from "../../../../domain/usescases/register/load-register";
import { noContent, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadRegistersController implements Controller {
  constructor(private readonly loadRegister: LoadRegisters) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const registers = await this.loadRegister.load();
      return registers.length ? ok(registers) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
