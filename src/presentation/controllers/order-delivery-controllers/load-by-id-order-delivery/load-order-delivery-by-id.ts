import { LoadOrderDeliveryById } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOrderDeliveryByIdController implements Controller {
  constructor(private readonly loadOrderDeliveryById: LoadOrderDeliveryById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId =
        Number(httpRequest.headers?.accountId || 0) || undefined;
      const oneOrderDelivery = await this.loadOrderDeliveryById.loadOne(
        Number(httpRequest.params.id),
        accountId,
      );
      return ok(oneOrderDelivery);
    } catch (error) {
      return serverError(error);
    }
  }
}
