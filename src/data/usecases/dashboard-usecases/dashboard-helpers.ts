import {
  DashboardNameValue,
  DashboardPeriodFilter,
  DateRange,
} from "../../../domain/models/dashboard/dashboard";
import { DashboardOrderDeliveryman } from "../../protocols/db/dashboard/dashboard-repository";

export const isValidDate = (date?: Date): date is Date =>
  !!date && !Number.isNaN(date.getTime());

export const toValidRange = (filter: DashboardPeriodFilter): DateRange | undefined =>
  isValidDate(filter.startDate) && isValidDate(filter.endDate)
    ? { startDate: filter.startDate, endDate: filter.endDate }
    : undefined;

export const formatDeliverymanName = (deliveryman: DashboardOrderDeliveryman): string =>
  `${deliveryman.name} ${deliveryman.lastName}`.trim();

export const countByName = (names: Array<string | undefined>): DashboardNameValue[] =>
  Array.from(
    names.reduce((totals, name) => {
      if (!name) {
        return totals;
      }
      totals.set(name, (totals.get(name) ?? 0) + 1);
      return totals;
    }, new Map<string, number>()),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
