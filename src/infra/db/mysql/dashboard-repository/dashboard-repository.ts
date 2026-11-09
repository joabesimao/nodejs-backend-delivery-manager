import { OrderStatus, PrismaClient } from "@prisma/client";
import {
  DashboardOrderLocation,
  DashboardOrderTimeline,
  DashboardOverviewData,
  LoadDashboardOrderLocationsRepository,
  LoadDashboardOrderTimelineRepository,
  LoadDashboardOverviewRepository,
} from "../../../../data/protocols/db/dashboard/dashboard-repository";
import { DateRange } from "../../../../domain/models/dashboard/dashboard";

const toDateWhere = (range?: DateRange) =>
  range ? { data: { gte: range.startDate, lte: range.endDate } } : undefined;

export class DashboardMysqlRepository
  implements
    LoadDashboardOverviewRepository,
    LoadDashboardOrderTimelineRepository,
    LoadDashboardOrderLocationsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadOverview(range?: DateRange): Promise<DashboardOverviewData> {
    const ordersWhere = toDateWhere(range);
    const [clients, deliverymen, cities, neighborhoods, activeDeliveries, revenue, latestOrders] =
      await Promise.all([
        this.prisma.client.count(),
        this.prisma.deliveryman.count(),
        this.prisma.city.count(),
        this.prisma.neighborhood.count(),
        this.prisma.orderDelivery.count({
          where: {
            ...ordersWhere,
            status: {
              in: [OrderStatus.actived, OrderStatus.delivered],
            },
          },
        }),
        this.prisma.orderDelivery.aggregate({
          where: {
            ...ordersWhere,
            status: OrderStatus.finished,
          },
          _sum: {
            amount: true,
          },
        }),
        this.prisma.orderDelivery.findMany({
          where: ordersWhere,
          include: {
            Register: {
              include: {
                client: true,
              },
            },
            deliveryman: true,
          },
          orderBy: {
            data: "desc",
          },
          take: 5,
        }),
      ]);

    return {
      clients,
      deliverymen,
      cities,
      neighborhoods,
      activeDeliveries,
      finishedRevenue: revenue._sum.amount ?? 0,
      latestOrders: latestOrders.map((order) => ({
        id: order.id,
        status: order.status,
        amount: order.amount,
        clientName: order.Register.client.name,
        deliveryman: order.deliveryman,
      })),
    };
  }

  async loadFinishedRevenue(range: DateRange): Promise<number> {
    const revenue = await this.prisma.orderDelivery.aggregate({
      where: {
        data: { gte: range.startDate, lte: range.endDate },
        status: OrderStatus.finished,
      },
      _sum: { amount: true },
    });
    return revenue._sum.amount ?? 0;
  }

  async loadOrderTimeline(range: DateRange): Promise<DashboardOrderTimeline[]> {
    return await this.prisma.orderDelivery.findMany({
      where: { data: { gte: range.startDate, lte: range.endDate } },
      select: { data: true, finishedAt: true, status: true },
    });
  }

  async loadOrderLocations(range?: DateRange): Promise<DashboardOrderLocation[]> {
    const orders = await this.prisma.orderDelivery.findMany({
      where: toDateWhere(range),
      include: {
        Register: {
          include: {
            address: true,
          },
        },
      },
    });
    return orders.map((order) => ({
      status: order.status,
      amount: order.amount,
      neighborhood: order.Register?.address?.neighborhood ?? null,
      city: order.Register?.address?.city ?? null,
    }));
  }
}
