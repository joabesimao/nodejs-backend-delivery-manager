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
      const filters = { ...httpRequest.query, ...httpRequest.headers };
      const startDate = new Date(filters?.startDate);
      const endDate = new Date(filters?.endDate);
      const status = String(filters?.status ?? "all");
      const page = Number(filters?.page ?? 1);
      const pageSize = Number(filters?.pageSize ?? 10);
      const accountId = Number(httpRequest.actor?.id || 0) || undefined;

      if (
        !filters?.startDate ||
        !filters?.endDate ||
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
