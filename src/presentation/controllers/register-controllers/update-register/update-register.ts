import { UpdateRegister } from "../../../../domain/usescases/register/update-register";
import { CpfInUseError } from "../../../../domain/errors";
import { conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateRegisterController implements Controller {
  constructor(private readonly update: UpdateRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const updateData = await this.update.update(
        httpRequest.params.id,
        httpRequest.body,
      );

      return ok(updateData);
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("cpf")) {
        return conflict(new CpfInUseError());
      }
      return serverError(error);
    }
  }
}
