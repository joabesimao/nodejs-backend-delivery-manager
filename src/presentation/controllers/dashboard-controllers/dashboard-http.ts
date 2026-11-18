import { DashboardPeriodFilter } from "../../../domain/models/dashboard/dashboard";
import { parseBusinessPeriodEnd, parseBusinessPeriodStart } from "../../../data/helpers/date-time";
import { HttpRequest } from "../../protocols/http";

export const readPeriodFilter = (httpRequest: HttpRequest): DashboardPeriodFilter => ({
  startDate: parseBusinessPeriodStart(httpRequest.query?.startDate),
  endDate: parseBusinessPeriodEnd(httpRequest.query?.endDate),
});
