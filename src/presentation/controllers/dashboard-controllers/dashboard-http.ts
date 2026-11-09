import { DashboardPeriodFilter } from "../../../domain/models/dashboard/dashboard";
import { HttpRequest } from "../../protocols/http";

const readDate = (value: unknown): Date | undefined =>
  typeof value === "string" && value ? new Date(value) : undefined;

export const readPeriodFilter = (httpRequest: HttpRequest): DashboardPeriodFilter => ({
  startDate: readDate(httpRequest.query?.startDate),
  endDate: readDate(httpRequest.query?.endDate),
});

