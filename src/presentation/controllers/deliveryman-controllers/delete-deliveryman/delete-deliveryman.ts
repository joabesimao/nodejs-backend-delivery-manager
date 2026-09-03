import { DeleteDeliveryman } from "../../../../domain/usescases/deliveryman/delete-deliveryman";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteDeliverymanController implements Controller {
  constructor(private readonly deleteDeliveryman: DeleteDeliveryman) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.deleteDeliveryman.delete(Number(id));
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
