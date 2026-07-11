import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateOrderDeliveryController implements Controller {
  constructor(private readonly updateOrderDelivery: UpdateOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId =
        Number(httpRequest.headers?.accountId || 0) || undefined;
      const updateOrderDelivery = await this.updateOrderDelivery.update(
        httpRequest.params.id,
        {
          ...httpRequest.body,
          accountId,
        },
      );
      return ok(updateOrderDelivery);
    } catch (error) {
      return serverError(error);
    }
  }
}
