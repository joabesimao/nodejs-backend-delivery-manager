import { OrderStatus } from "../order-delivery/order-delivery";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DashboardPeriodFilter {
  startDate?: Date;
  endDate?: Date;
}

export interface DashboardLatestDelivery {
  id: number;
  status: OrderStatus;
  amount: number;
  clientName: string;
  deliverymanName: string;
}

export interface DashboardOverview {
  period: DateRange | null;
  metrics: {
    clients: number;
    deliverymen: number;
    activeDeliveries: number;
    deliveredRevenue: number;
    deliveredRevenuePreviousPeriod: number | null;
    cities: number;
    neighborhoods: number;
  };
  latestDeliveries: DashboardLatestDelivery[];
}

export interface DashboardDayTotal {
  date: string;
  label: string;
  total: number;
}

export interface DashboardPerformance {
  period: DateRange;
  days: DashboardDayTotal[];
  totalOrders: number;
  avgDeliveryMinutes: number | null;
  peakDay: DashboardDayTotal | null;
}

export interface DashboardNameValue {
  name: string;
  value: number;
}

export interface DashboardReports {
  summary: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  byNeighborhood: DashboardNameValue[];
  byCity: DashboardNameValue[];
  byStatus: DashboardNameValue[];
}
