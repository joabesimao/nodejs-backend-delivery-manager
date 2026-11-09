import { LoadDashboardOverview } from "../../../domain/usescases/dashboard/load-dashboard-overview";
import { ok, serverErrorMessage } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { readPeriodFilter } from "./dashboard-http";

export class LoadDashboardOverviewController implements Controller {
  constructor(private readonly loadDashboardOverview: LoadDashboardOverview) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return ok(await this.loadDashboardOverview.load(readPeriodFilter(httpRequest)));
    } catch (error) {
      console.error("[dashboard/overview] Erro ao carregar dados:", error);
      return serverErrorMessage("Falha ao carregar dados do dashboard");
    }
  }
}
