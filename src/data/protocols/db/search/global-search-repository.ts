import { DashboardOrderDeliveryman } from "../dashboard/dashboard-repository";
import { OrderStatus } from "../../../../domain/models/order-delivery/order-delivery";
import { GlobalSearchResult } from "../../../../domain/models/search/global-search";

export interface GlobalSearchOrderRow {
  id: number;
  status: OrderStatus;
  amount: number;
  clientName: string | null;
  deliveryman: DashboardOrderDeliveryman | null;
}

export interface GlobalSearchRepository {
  searchOrders(term: string, orderId: number | undefined, limit: number): Promise<GlobalSearchOrderRow[]>;
  searchClients(term: string, limit: number): Promise<GlobalSearchResult["clients"]>;
  searchDeliverymen(term: string, limit: number): Promise<GlobalSearchResult["deliverymen"]>;
}
