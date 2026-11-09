import {
  DashboardPeriodFilter,
  DashboardReports,
} from "../../../domain/models/dashboard/dashboard";
import { LoadDashboardReports } from "../../../domain/usescases/dashboard/load-dashboard-reports";
import { LoadDashboardOrderLocationsRepository } from "../../protocols/db/dashboard/dashboard-repository";
import { countByName, toValidRange } from "./dashboard-helpers";

export class DbLoadDashboardReports implements LoadDashboardReports {
  constructor(
    private readonly loadDashboardOrderLocationsRepository: LoadDashboardOrderLocationsRepository,
  ) {}

  async load(filter: DashboardPeriodFilter): Promise<DashboardReports> {
    const orders = await this.loadDashboardOrderLocationsRepository.loadOrderLocations(
      toValidRange(filter),
    );

    const finishedOrders = orders.filter((order) => order.status === "finished");
    const completedOrders = finishedOrders.length;
    const pendingOrders = orders.length - completedOrders;

    return {
      summary: {
        totalOrders: orders.length,
        completedOrders,
        pendingOrders,
        totalRevenue: finishedOrders.reduce((sum, order) => sum + Number(order.amount ?? 0), 0),
      },
      byNeighborhood: countByName(orders.map((order) => order.neighborhood?.trim())),
      byCity: countByName(orders.map((order) => order.city?.trim())),
      byStatus: [
        { name: "Finalizadas", value: completedOrders },
        { name: "Pendentes", value: pendingOrders },
      ],
    };
  }
}
