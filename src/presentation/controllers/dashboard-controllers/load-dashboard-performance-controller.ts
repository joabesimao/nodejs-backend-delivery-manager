import { LoadDashboardPerformance } from "../../../domain/usescases/dashboard/load-dashboard-performance";
import { ok, serverErrorMessage } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { readPeriodFilter } from "./dashboard-http";

export class LoadDashboardPerformanceController implements Controller {
  constructor(private readonly loadDashboardPerformance: LoadDashboardPerformance) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return ok(await this.loadDashboardPerformance.load(readPeriodFilter(httpRequest)));
    } catch (error) {
      console.error("[dashboard/performance] Erro ao carregar dados:", error);
      return serverErrorMessage("Falha ao carregar desempenho do dashboard");
    }
  }
}
