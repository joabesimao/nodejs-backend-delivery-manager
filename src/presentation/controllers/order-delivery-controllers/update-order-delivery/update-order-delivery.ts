import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import {
  badRequest,
  conflict,
  forbidden,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { InvalidParamError } from "../../../errors/invalid-params-error";
import { OrderFieldChangeDeniedError } from "../../../errors/order-field-change-denied-error";
import { OrderStatusTransitionError } from "../../../errors/order-status-transition-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

const ORDER_STATUSES = ["actived", "delivered", "finished"];

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

      const requestBody: Record<string, unknown> = {
        ...httpRequest.body,
        accountId,
        accountRole: httpRequest.headers?.accountRole,
      };

      if (requestBody.amount !== undefined) {
        const parsedAmount = parseAmount(requestBody.amount);
        if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
          return badRequest(new InvalidParamError("amount"));
        }
        requestBody.amount = parsedAmount;
      }

      if (
        requestBody.status !== undefined &&
        !ORDER_STATUSES.includes(requestBody.status as string)
      ) {
        return badRequest(new InvalidParamError("status"));
      }

      if (requestBody.quantity !== undefined) {
        const quantity =
          typeof requestBody.quantity === "number" ||
          typeof requestBody.quantity === "string"
            ? String(requestBody.quantity).trim()
            : "";
        if (!quantity) {
          return badRequest(new InvalidParamError("quantity"));
        }
        requestBody.quantity = quantity;
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
      if (error instanceof OrderFieldChangeDeniedError) {
        return forbidden(error);
      }
      if (error instanceof OrderStatusTransitionError) {
        return conflict(error);
      }
      return serverError(error);
    }
  }
}
