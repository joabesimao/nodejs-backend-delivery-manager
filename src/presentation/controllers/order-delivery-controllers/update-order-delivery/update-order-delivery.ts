import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { InvalidParamError } from "../../../errors/invalid-params-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

const parseAmount = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  const raw = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/[^\d.,-]/g, "");

  if (!raw) {
    return Number.NaN;
  }

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");

  let normalized = raw;

  if (hasComma && hasDot) {
    const commaIsDecimal = raw.lastIndexOf(",") > raw.lastIndexOf(".");
    normalized = commaIsDecimal
      ? raw.replace(/\./g, "").replace(",", ".")
      : raw.replace(/,/g, "");
  } else if (hasComma) {
    normalized = raw.replace(",", ".");
  }

  return Number(normalized);
};

export class UpdateOrderDeliveryController implements Controller {
  constructor(private readonly updateOrderDelivery: UpdateOrderDelivery) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accountId =
        Number(httpRequest.headers?.accountId || 0) || undefined;
      const parsedId = Number(httpRequest.params.id);

      if (Number.isNaN(parsedId) || parsedId <= 0) {
        return badRequest(new InvalidParamError("id"));
      }

      const requestBody = {
        ...httpRequest.body,
        accountId,
      } as Record<string, unknown>;

      if (requestBody.amount !== undefined) {
        const parsedAmount = parseAmount(requestBody.amount);
        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
          return badRequest(new InvalidParamError("amount"));
        }
        requestBody.amount = parsedAmount;
      }

      if (
        requestBody.deliverymanId !== undefined &&
        requestBody.deliverymanId !== null &&
        requestBody.deliverymanId !== ""
      ) {
        const parsedDeliverymanId = Number(requestBody.deliverymanId);
        if (Number.isNaN(parsedDeliverymanId)) {
          return badRequest(new InvalidParamError("deliverymanId"));
        }
        requestBody.deliverymanId = parsedDeliverymanId;
      }

      const updateOrderDelivery = await this.updateOrderDelivery.update(
        parsedId,
        requestBody as any,
      );
      return ok(updateOrderDelivery);
    } catch (error) {
      return serverError(error);
    }
  }
}
