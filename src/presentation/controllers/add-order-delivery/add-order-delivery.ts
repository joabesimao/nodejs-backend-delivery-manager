import { idText } from "typescript";
import { AddOrderDelivery } from "../../../domain/usescases/order-delivery/order-delivery";
import { MissingParamError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class AddOrderDeliveryController implements Controller {
  constructor(private readonly addOrderDelivery: AddOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { register, amount, data, quantity } = httpRequest.body;
      const requireFields = ["register", "amount", "data", "quantity"];
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const orderDelivery = await this.addOrderDelivery.addOrderDelivery({
        register: register,
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
