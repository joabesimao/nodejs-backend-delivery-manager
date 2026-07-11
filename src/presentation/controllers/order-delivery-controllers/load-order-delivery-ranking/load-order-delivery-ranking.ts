import { LoadOrderDeliveryRanking } from "../../../../domain/usescases/order-delivery/load-order-delivery";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOrderDeliveryRankingController implements Controller {
  constructor(
    private readonly loadOrderDeliveryRanking: LoadOrderDeliveryRanking
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const startDate = new Date(httpRequest.headers?.startDate);
      const endDate = new Date(httpRequest.headers?.endDate);
      const status = String(httpRequest.headers?.status ?? "all");
      const page = Number(httpRequest.headers?.page ?? 1);
      const pageSize = Number(httpRequest.headers?.pageSize ?? 10);
      const accountId = Number(httpRequest.headers?.accountId || 0) || undefined;

      if (
        !httpRequest.headers?.startDate ||
        !httpRequest.headers?.endDate ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return badRequest(new Error("Parâmetros startDate e endDate são obrigatórios."));
      }

      if (startDate > endDate) {
        return badRequest(new Error("startDate deve ser menor ou igual a endDate."));
      }

      if (!["all", "delivered", "finished"].includes(status)) {
        return badRequest(new Error("status deve ser all, delivered ou finished."));
      }

      if (!Number.isInteger(page) || page < 1) {
        return badRequest(new Error("page deve ser um inteiro maior ou igual a 1."));
      }

      if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
        return badRequest(new Error("pageSize deve ser um inteiro entre 1 e 100."));
      }

      const ranking = await this.loadOrderDeliveryRanking.loadByPeriod({
        startDate,
        endDate,
        status: status as "all" | "delivered" | "finished",
        page,
        pageSize,
        accountId,
      });

      return ok(ranking);
    } catch (error) {
      return serverError(error);
    }
  }
}
