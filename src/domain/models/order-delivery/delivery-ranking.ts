export interface DeliveryRankingFilter {
  startDate: Date;
  endDate: Date;
  status?: "delivered" | "finished" | "all";
  page: number;
  pageSize: number;
}

export interface DeliveryRankingModel {
  deliverymanId: number;
  deliverymanName: string;
  totalDeliveries: number;
}

export interface DeliveryRankingPaginatedModel {
  items: DeliveryRankingModel[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  totalDeliveries: number;
}
