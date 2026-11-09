import {
  DashboardDayTotal,
  DashboardPerformance,
  DashboardPeriodFilter,
} from "../../../domain/models/dashboard/dashboard";
import { LoadDashboardPerformance } from "../../../domain/usescases/dashboard/load-dashboard-performance";
import { LoadDashboardOrderTimelineRepository } from "../../protocols/db/dashboard/dashboard-repository";
import { isValidDate } from "./dashboard-helpers";

const dayFormatter = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });

export class DbLoadDashboardPerformance implements LoadDashboardPerformance {
  constructor(
    private readonly loadDashboardOrderTimelineRepository: LoadDashboardOrderTimelineRepository,
  ) {}

  async load(filter: DashboardPeriodFilter): Promise<DashboardPerformance> {
    const now = new Date();
    const defaultEnd = new Date(now);
    defaultEnd.setHours(23, 59, 59, 999);
    const defaultStart = new Date(now);
    defaultStart.setDate(defaultStart.getDate() - 6);
    defaultStart.setHours(0, 0, 0, 0);

    const startDate = isValidDate(filter.startDate) ? filter.startDate : defaultStart;
    const endDate = isValidDate(filter.endDate) ? filter.endDate : defaultEnd;

    const orders = await this.loadDashboardOrderTimelineRepository.loadOrderTimeline({
      startDate,
      endDate,
    });

    const totalsByDay = new Map<string, DashboardDayTotal>();
    orders.forEach((order) => {
      const dateKey = order.data.toISOString().slice(0, 10);
      if (!totalsByDay.has(dateKey)) {
        totalsByDay.set(dateKey, {
          date: dateKey,
          label: dayFormatter.format(order.data).replace(".", ""),
          total: 0,
        });
      }
      totalsByDay.get(dateKey).total += 1;
    });

    const days = Array.from(totalsByDay.values()).sort((a, b) => a.date.localeCompare(b.date));

    const finishedWithDuration = orders.filter(
      (order) => order.status === "finished" && order.finishedAt,
    );
    const avgDeliveryMinutes = finishedWithDuration.length
      ? Math.round(
          finishedWithDuration.reduce(
            (sum, order) => sum + (order.finishedAt.getTime() - order.data.getTime()) / 60000,
            0,
          ) / finishedWithDuration.length,
        )
      : null;

    const peakDay = days.reduce<DashboardDayTotal | null>(
      (peak, day) => (!peak || day.total > peak.total ? day : peak),
      null,
    );

    return {
      period: { startDate, endDate },
      days,
      totalOrders: orders.length,
      avgDeliveryMinutes,
      peakDay,
    };
  }
}
