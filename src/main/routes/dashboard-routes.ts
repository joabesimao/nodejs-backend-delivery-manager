import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadDashboardOverviewController, makeLoadDashboardPerformanceController, makeLoadDashboardReportsController } from "../factories/dashboard";
import { DASHBOARD_READ_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/dashboard/overview",
    auth(DASHBOARD_READ_ROLES),
    adaptRoute(makeLoadDashboardOverviewController()),
  );
  router.get(
    "/dashboard/performance",
    auth(DASHBOARD_READ_ROLES),
    adaptRoute(makeLoadDashboardPerformanceController()),
  );
  router.get(
    "/dashboard/reports",
    auth(DASHBOARD_READ_ROLES),
    adaptRoute(makeLoadDashboardReportsController()),
  );
};
