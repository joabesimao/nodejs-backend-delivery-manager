import { DeleteOrderDelivery } from "../../../../domain/usescases/order-delivery/delete-order-delivery";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { mapDomainError } from "../../../helpers/http/map-domain-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteOrderDeliveryController implements Controller {
  constructor(private readonly deleteOrderDelivery: DeleteOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId =
        Number(httpRequest.actor?.id || 0) || undefined;
      const result = await this.deleteOrderDelivery.delete(
        Number(httpRequest.params.id),
        accountId,
      );
      return ok(result);
    } catch (error) {
      return mapDomainError(error) ?? serverError(error);
    }
  }
}
