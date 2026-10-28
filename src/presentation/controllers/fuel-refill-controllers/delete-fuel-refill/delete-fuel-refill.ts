import { DeleteFuelRefill } from "../../../../domain/usescases/fuel-refill/delete-fuel-refill";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteFuelRefillController implements Controller {
  constructor(private readonly deleteFuelRefill: DeleteFuelRefill) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const deleted = await this.deleteFuelRefill.delete(Number(id));
      if (!deleted) {
        return noExists();
      }
      return ok("Deletado com sucesso!");
    } catch (error) {
      return serverError(error);
    }
  }
}
