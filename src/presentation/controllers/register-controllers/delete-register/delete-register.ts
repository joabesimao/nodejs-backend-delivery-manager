import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { DeleteRegister } from "../../../../domain/usescases/delete-register/delete-register";
import { ok, serverError } from "../../../helpers/http/http-helper";

export class DeleteRegisterController implements Controller {
  constructor(private readonly deleteRegister: DeleteRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const deleteRegister = await this.deleteRegister.delete(
        httpRequest.params.id
      );
      return ok(deleteRegister);
    } catch (error) {
      return serverError(error);
    }
  }
}
