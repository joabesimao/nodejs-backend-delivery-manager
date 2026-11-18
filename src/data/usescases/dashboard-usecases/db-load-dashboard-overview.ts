import {
  DashboardOverview,
  DashboardPeriodFilter,
} from "../../../domain/models/dashboard/dashboard";
import { LoadDashboardOverview } from "../../../domain/usescases/dashboard/load-dashboard-overview";
import { LoadDashboardOverviewRepository } from "../../protocols/db/dashboard/dashboard-repository";
import { formatDeliverymanName, toValidRange } from "./dashboard-helpers";

export class DbLoadDashboardOverview implements LoadDashboardOverview {
  constructor(private readonly loadDashboardOverviewRepository: LoadDashboardOverviewRepository) {}

  async load(filter: DashboardPeriodFilter): Promise<DashboardOverview> {
    const range = toValidRange(filter);
    const overview = await this.loadDashboardOverviewRepository.loadOverview(range);

    let previousRevenue: number | null = null;
    if (range) {
      const rangeMs = range.endDate.getTime() - range.startDate.getTime();
      previousRevenue = await this.loadDashboardOverviewRepository.loadFinishedRevenue({
        startDate: new Date(range.startDate.getTime() - rangeMs),
        endDate: range.startDate,
      });
    }

    return {
      period: range ?? null,
      metrics: {
        clients: overview.clients,
        deliverymen: overview.deliverymen,
        activeDeliveries: overview.activeDeliveries,
        deliveredRevenue: overview.finishedRevenue,
        deliveredRevenuePreviousPeriod: previousRevenue,
        cities: overview.cities,
        neighborhoods: overview.neighborhoods,
      },
      latestDeliveries: overview.latestOrders.map((order) => ({
        id: order.id,
        status: order.status,
        amount: order.amount,
        clientName: order.clientName,
        deliverymanName: order.deliveryman
          ? formatDeliverymanName(order.deliveryman)
          : "Sem entregador",
      })),
    };
  }
}
