import { DashboardPeriodFilter, DashboardOverview } from "../../models/dashboard/dashboard";

export interface LoadDashboardOverview {
  load(filter: DashboardPeriodFilter): Promise<DashboardOverview>;
}
