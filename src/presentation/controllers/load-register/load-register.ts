import { LoadRegisters } from "../../../domain/usescases/loadRegister/load-register";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoadRegistersController implements Controller {
  constructor(private readonly loadRegister: LoadRegisters) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadRegister.load();
    return null;
  }
}
