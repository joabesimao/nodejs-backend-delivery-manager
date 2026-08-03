import { AddOrderDelivery } from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { InvalidParamError } from "../../../errors/invalid-params-error";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

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

export class AddOrderDeliveryController implements Controller {
  constructor(
    private readonly addOrderDelivery: AddOrderDelivery,
    private readonly validation: Validation,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requestTrace = {
      at: new Date().toISOString(),
      route: "POST /orderDelivery",
      accountId: Number(httpRequest.headers?.accountId || 0) || null,
      registerId: httpRequest.body?.registerId ?? null,
      deliverymanId: httpRequest.body?.deliverymanId ?? null,
      quantity: httpRequest.body?.quantity ?? null,
      amount: httpRequest.body?.amount ?? null,
    };

    try {
      console.info("[orderDelivery:create] request", requestTrace);

      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        console.warn("[orderDelivery:create] validation_error", {
          ...requestTrace,
          reason: error.message,
        });
        return badRequest(error);
      }

      const { amount, data, quantity, registerId, deliverymanId } =
        httpRequest.body;
      const accountId =
        Number(httpRequest.headers?.accountId || 0) || undefined;

      const parsedRegisterId = Number(registerId);
      if (Number.isNaN(parsedRegisterId) || parsedRegisterId <= 0) {
        return badRequest(new InvalidParamError("registerId"));
      }

      const parsedAmount = parseAmount(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
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

      console.info("[orderDelivery:create] success", {
        ...requestTrace,
        createdOrderId: orderDelivery?.id ?? null,
        parsedAmount,
      });

      return ok(orderDelivery);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      console.error("[orderDelivery:create] error", {
        ...requestTrace,
        reason: message || "Erro desconhecido",
      });

      if (
        message.includes("Cadastro nao encontrado") ||
        message.includes("Entregador nao encontrado") ||
        message.includes("Conta vinculada a loja inexistente") ||
        message.includes("Sem permissao") ||
        message.includes("Foreign key constraint")
      ) {
        return badRequest(new Error(message || "Dados invalidos para criar pedido"));
      }

      return serverError(error);
    }
  }
}
