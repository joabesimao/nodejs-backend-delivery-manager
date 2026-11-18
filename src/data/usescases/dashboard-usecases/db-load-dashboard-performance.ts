import {
  DashboardDayTotal,
  DashboardPerformance,
  DashboardPeriodFilter,
} from "../../../domain/models/dashboard/dashboard";
import { LoadDashboardPerformance } from "../../../domain/usescases/dashboard/load-dashboard-performance";
import {
  businessDayKey,
  businessWeekdayLabel,
  defaultBusinessRange,
} from "../../helpers/date-time";
import { LoadDashboardOrderTimelineRepository } from "../../protocols/db/dashboard/dashboard-repository";
import { toValidRange } from "./dashboard-helpers";

const DEFAULT_PERIOD_DAYS = 7;

export class DbLoadDashboardPerformance implements LoadDashboardPerformance {
  constructor(
    private readonly loadDashboardOrderTimelineRepository: LoadDashboardOrderTimelineRepository,
  ) {}

  async load(filter: DashboardPeriodFilter): Promise<DashboardPerformance> {
    const { startDate, endDate } =
      toValidRange(filter) ?? defaultBusinessRange(DEFAULT_PERIOD_DAYS);

    const orders = await this.loadDashboardOrderTimelineRepository.loadOrderTimeline({
      startDate,
      endDate,
    });

    const totalsByDay = new Map<string, DashboardDayTotal>();
    orders.forEach((order) => {
      const dateKey = businessDayKey(order.data);
      if (!totalsByDay.has(dateKey)) {
        totalsByDay.set(dateKey, {
          date: dateKey,
          label: businessWeekdayLabel(order.data),
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
