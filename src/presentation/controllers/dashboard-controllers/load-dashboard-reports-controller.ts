import { LoadDashboardReports } from "../../../domain/usescases/dashboard/load-dashboard-reports";
import { ok, serverErrorMessage } from "../../helpers/http/http-helper";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import { readPeriodFilter } from "./dashboard-http";

export class LoadDashboardReportsController implements Controller {
  constructor(private readonly loadDashboardReports: LoadDashboardReports) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return ok(await this.loadDashboardReports.load(readPeriodFilter(httpRequest)));
    } catch {
      return serverErrorMessage("Falha ao carregar dados de relatórios do dashboard");
    }
  }
}
