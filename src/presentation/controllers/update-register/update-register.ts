import { UpdateRegister } from "../../../domain/usescases/updateRegister/update-register";
import { ok } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class UpdateRegisterController implements Controller {
  constructor(private readonly update: UpdateRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const updateData = await this.update.update(
      httpRequest.params.id,
      httpRequest.body
    );

    return ok("updateData");
  }
}
