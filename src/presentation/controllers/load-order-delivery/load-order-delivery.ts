import { LoadOrderDelivery } from "../../../domain/usescases/order-delivery/load-order-delivery";
import { Validation } from "../../protocols/validation";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class LoadOrderDeliveryController implements Controller {
  constructor(
    private readonly loadOrderDelivery: LoadOrderDelivery,
    private readonly validation: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const allOrders = await this.loadOrderDelivery.loadAll();
      return ok(allOrders);
    } catch (error) {
      return serverError(error);
    }
  }
}
