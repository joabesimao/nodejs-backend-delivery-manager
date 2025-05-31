import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { DeleteRegister } from "../../../../domain/usescases/register/delete-register";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";

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
