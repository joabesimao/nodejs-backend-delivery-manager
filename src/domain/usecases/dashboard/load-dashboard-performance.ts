import { DashboardPeriodFilter, DashboardPerformance } from "../../models/dashboard/dashboard";

export interface LoadDashboardPerformance {
  load(filter: DashboardPeriodFilter): Promise<DashboardPerformance>;
}
