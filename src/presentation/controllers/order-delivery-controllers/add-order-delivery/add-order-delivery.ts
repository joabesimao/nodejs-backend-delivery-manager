import { AddOrderDelivery } from "../../../../domain/usescases/order-delivery/add-order-delivery";
import {
  badRequest,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { InvalidParamError } from "../../../errors/invalid-params-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

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

export class AddOrderDeliveryController implements Controller {
  constructor(
    private readonly addOrderDelivery: AddOrderDelivery,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const {
        amount,
        data,
        quantity,
        registerId,
        deliverymanId,
      } = httpRequest.body;
      const accountId =
        Number(httpRequest.headers?.accountId || 0) || undefined;

      const parsedRegisterId = Number(registerId);
      if (Number.isNaN(parsedRegisterId) || parsedRegisterId <= 0) {
        return badRequest(new InvalidParamError("registerId"));
      }

      const parsedAmount = parseAmount(amount);
      if (parsedAmount <= 0) {
        return badRequest(new InvalidParamError("amount"));
      }

      const parsedDeliverymanId =
        deliverymanId !== undefined && deliverymanId !== null && deliverymanId !== ""
          ? Number(deliverymanId)
          : undefined;
      if (
        parsedDeliverymanId !== undefined &&
        Number.isNaN(parsedDeliverymanId)
      ) {
        return badRequest(new InvalidParamError("deliverymanId"));
      }

      const orderDelivery = await this.addOrderDelivery.addOrderDelivery({
        registerId: parsedRegisterId,
        deliverymanId: parsedDeliverymanId,
        amount: parsedAmount,
        data: data ? new Date(data) : new Date(),
        quantity: String(quantity),
        accountId,
      });
      return ok(orderDelivery);
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return badRequest(error);
      }
      return serverError(error);
    }
  }
}
