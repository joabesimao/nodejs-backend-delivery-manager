import { DashboardPeriodFilter, DashboardReports } from "../../models/dashboard/dashboard";

export interface LoadDashboardReports {
  load(filter: DashboardPeriodFilter): Promise<DashboardReports>;
}
