import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { DeleteRegister } from "../../../../domain/usescases/register/delete-register";
import { conflict, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";

export class DeleteRegisterController implements Controller {
  constructor(private readonly deleteRegister: DeleteRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const deleteRegister = await this.deleteRegister.delete(
        httpRequest.params.id
      );
      return ok(deleteRegister);
    } catch (error) {
      if (error instanceof ResourceInUseError) {
        return conflict(error);
      }
      if (error instanceof NotFoundError) {
        return noExists();
      }
      return serverError(error);
    }
  }
}
