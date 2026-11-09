import { DateRange } from "../../../../domain/models/dashboard/dashboard";
import { OrderStatus } from "../../../../domain/models/order-delivery/order-delivery";

export interface DashboardOrderDeliveryman {
  name: string;
  lastName: string;
}

export interface DashboardOverviewData {
  clients: number;
  deliverymen: number;
  cities: number;
  neighborhoods: number;
  activeDeliveries: number;
  finishedRevenue: number;
  latestOrders: Array<{
    id: number;
    status: OrderStatus;
    amount: number;
    clientName: string;
    deliveryman: DashboardOrderDeliveryman | null;
  }>;
}

export interface LoadDashboardOverviewRepository {
  loadOverview(range?: DateRange): Promise<DashboardOverviewData>;
  loadFinishedRevenue(range: DateRange): Promise<number>;
}

export interface DashboardOrderTimeline {
  data: Date;
  finishedAt: Date | null;
  status: OrderStatus;
}

export interface LoadDashboardOrderTimelineRepository {
  loadOrderTimeline(range: DateRange): Promise<DashboardOrderTimeline[]>;
}

export interface DashboardOrderLocation {
  status: OrderStatus;
  amount: number | null;
  neighborhood: string | null;
  city: string | null;
}

export interface LoadDashboardOrderLocationsRepository {
  loadOrderLocations(range?: DateRange): Promise<DashboardOrderLocation[]>;
}
