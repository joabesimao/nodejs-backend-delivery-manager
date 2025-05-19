import { AddOrderDelivery } from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddOrderDeliveryController implements Controller {
  constructor(
    private readonly addOrderDelivery: AddOrderDelivery,
    private readonly validation: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { amount, data, quantity, registerId } = httpRequest.body;
      const orderDelivery = await this.addOrderDelivery.addOrderDelivery({
        registerId: registerId,
        amount: amount,
        data: data,
        quantity: quantity,
      });
      return ok(orderDelivery);
    } catch (error) {
      return serverError(error);
    }
  }
}
