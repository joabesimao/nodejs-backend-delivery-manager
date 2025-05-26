import { LoadOrderDelivery } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOrderDeliveryController implements Controller {
  constructor(private readonly loadOrderDelivery: LoadOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const allOrders = await this.loadOrderDelivery.loadAll();
      return ok(allOrders);
    } catch (error) {
      return serverError(error);
    }
  }
}
