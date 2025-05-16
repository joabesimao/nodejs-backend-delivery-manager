import { Prisma } from "@prisma/client";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateOrderDeliveryController implements Controller {
  constructor(private readonly updateOrderDelivery: UpdateOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const updateOrderDelivery = await this.updateOrderDelivery.update(
        httpRequest.params.id,
        httpRequest.body
      );
      return ok(updateOrderDelivery);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return noExists();
      }
      return serverError(error);
    }
  }
}
