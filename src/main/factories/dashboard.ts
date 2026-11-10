import { DbLoadDashboardOverview } from "../../data/usescases/dashboard-usecases/db-load-dashboard-overview";
import { DbLoadDashboardPerformance } from "../../data/usescases/dashboard-usecases/db-load-dashboard-performance";
import { DbLoadDashboardReports } from "../../data/usescases/dashboard-usecases/db-load-dashboard-reports";
import { DbGlobalSearch } from "../../data/usescases/search-usecases/db-global-search";
import {
  LoadDashboardOverviewController,
  LoadDashboardPerformanceController,
  LoadDashboardReportsController,
} from "../../presentation/controllers/dashboard-controllers";
import { GlobalSearchController } from "../../presentation/controllers/search-controllers/global-search-controller";
import { makeDashboardRepository, makeGlobalSearchRepository } from "./repositories";

export const makeLoadDashboardOverviewController = (): LoadDashboardOverviewController =>
  new LoadDashboardOverviewController(new DbLoadDashboardOverview(makeDashboardRepository()));

export const makeLoadDashboardPerformanceController = (): LoadDashboardPerformanceController =>
  new LoadDashboardPerformanceController(new DbLoadDashboardPerformance(makeDashboardRepository()));

export const makeLoadDashboardReportsController = (): LoadDashboardReportsController =>
  new LoadDashboardReportsController(new DbLoadDashboardReports(makeDashboardRepository()));

export const makeGlobalSearchController = (): GlobalSearchController =>
  new GlobalSearchController(new DbGlobalSearch(makeGlobalSearchRepository()));
