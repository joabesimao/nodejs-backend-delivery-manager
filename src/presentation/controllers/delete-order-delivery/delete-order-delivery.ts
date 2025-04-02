import { DeleteOrderDelivery } from "../../../domain/usescases/order-delivery/delete-order-delivery";
import { ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class DeleteOrderDeliveryController implements Controller {
  constructor(private readonly deleteOrderDelivery: DeleteOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.deleteOrderDelivery.delete(
        httpRequest.params.id
      );
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
