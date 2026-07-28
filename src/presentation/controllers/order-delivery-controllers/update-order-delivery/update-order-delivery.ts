import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import {
  badRequest,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { InvalidParamError } from "../../../errors/invalid-params-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

const parseAmount = (value: unknown): number => {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new InvalidParamError("amount");
  }
  const normalizedAmount = String(value)
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");
  const amount = Number(normalizedAmount);
  if (Number.isNaN(amount)) {
    throw new InvalidParamError("amount");
  }
  return amount;
};

export class UpdateOrderDeliveryController implements Controller {
  constructor(private readonly updateOrderDelivery: UpdateOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId =
        Number(httpRequest.headers?.accountId || 0) || undefined;

      const requestBody = {
        ...httpRequest.body,
        accountId,
      } as any;

      if (requestBody.amount !== undefined) {
        requestBody.amount = parseAmount(requestBody.amount);
        if (requestBody.amount <= 0) {
          return badRequest(new InvalidParamError("amount"));
        }
      }

      if (
        requestBody.deliverymanId !== undefined &&
        requestBody.deliverymanId !== null &&
        requestBody.deliverymanId !== ""
      ) {
        requestBody.deliverymanId = Number(requestBody.deliverymanId);
        if (Number.isNaN(requestBody.deliverymanId)) {
          return badRequest(new InvalidParamError("deliverymanId"));
        }
      }

      const updateOrderDelivery = await this.updateOrderDelivery.update(
        requestBody.id ?? httpRequest.params.id,
        requestBody,
      );
      return ok(updateOrderDelivery);
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return badRequest(error);
      }
      return serverError(error);
    }
  }
}
