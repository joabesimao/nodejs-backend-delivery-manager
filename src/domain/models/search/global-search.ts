import { OrderStatus } from "../order-delivery/order-delivery";

export interface GlobalSearchResult {
  query: string;
  orders: Array<{
    id: number;
    status: OrderStatus;
    amount: number;
    clientName: string;
    deliverymanName: string | null;
  }>;
  clients: Array<{
    id: number;
    name: string;
    cpf: string;
    phone: string;
  }>;
  deliverymen: Array<{
    id: number;
    name: string;
    lastName: string;
    phone: string;
  }>;
}
