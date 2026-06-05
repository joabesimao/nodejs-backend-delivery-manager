import { OrderStatus, PrismaClient } from "@prisma/client";
import { AddOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/add-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../../../data/protocols/db/order-delivery/delete-order-delivery";
import {
  LoadOrderDeliveryRankingRepository,
  LoadOrderDeliveryByIdRepository,
  LoadOrderDeliveryRepository,
} from "../../../../data/protocols/db/order-delivery/load-order-delivery";
import {
  DeliveryRankingFilter,
  DeliveryRankingModel,
  DeliveryRankingPaginatedModel,
} from "../../../../domain/models/order-delivery/delivery-ranking";
import { UpdateOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/add-order-delivery";

export class OrderDeliveryMySqlRepository
  implements
    AddOrderDeliveryRepository,
    LoadOrderDeliveryRepository,
    LoadOrderDeliveryByIdRepository,
    LoadOrderDeliveryRankingRepository,
    UpdateOrderDeliveryRepository,
    DeleteOrderDeliveryByIdRepository
{
  constructor(private readonly prisma: PrismaClient) {}
  async getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]> {
    const allOrderDelivery = await this.prisma.orderDelivery.findMany({
      include: {
        Register: {
          include: {
            client: true,
            address: true,
          },
        },
      },
    });

    return allOrderDelivery as unknown as OrderDeliveryModel[];
  }
  async addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const order = await this.prisma.orderDelivery.create({
      data: {
        registerId: orderOfDelivery.registerId,
        amount: Number(orderOfDelivery.amount),
        data: new Date(),
        quantity: orderOfDelivery.quantity,
      },
    });
    return order as unknown as OrderDeliveryModel;
  }

  async getOneOrderOfDelivery(id: number): Promise<OrderDeliveryModel> {
    const orderById = await this.prisma.orderDelivery.findUnique({
      where: { id: Number(id) },
      include: {
        Register: {
          include: {
            client: true,
            address: true,
          },
        },
      },
    });
    return orderById as unknown as OrderDeliveryModel;
  }

  async getDeliverymanRankingByPeriod(
    filter: DeliveryRankingFilter
  ): Promise<DeliveryRankingPaginatedModel> {
    const statusFilter: OrderStatus[] =
      filter.status === "all" || !filter.status
        ? [OrderStatus.delivered, OrderStatus.finished]
        : [filter.status as OrderStatus];

    const deliveries = await this.prisma.orderDelivery.findMany({
      where: {
        data: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
        status: {
          in: statusFilter,
        },
      },
      include: {
        Register: {
          include: {
            client: true,
          },
        },
      },
    });

    const totalsByRegister = new Map<number, DeliveryRankingModel>();

    for (const delivery of deliveries) {
      const registerId = delivery.registerId;
      const current = totalsByRegister.get(registerId);
      const deliverymanName = `${delivery.Register.client.name} ${delivery.Register.client.lastName}`.trim();

      if (!current) {
        totalsByRegister.set(registerId, {
          registerId,
          deliverymanName,
          totalDeliveries: 1,
        });
        continue;
      }

      current.totalDeliveries += 1;
    }

    const sortedItems = Array.from(totalsByRegister.values()).sort(
      (a, b) =>
        b.totalDeliveries - a.totalDeliveries ||
        a.deliverymanName.localeCompare(b.deliverymanName)
    );

    const totalItems = sortedItems.length;
    const totalDeliveries = sortedItems.reduce(
      (sum, item) => sum + item.totalDeliveries,
      0
    );
    const totalPages = Math.max(1, Math.ceil(totalItems / filter.pageSize));
    const currentPage = Math.min(filter.page, totalPages);
    const startIndex = (currentPage - 1) * filter.pageSize;
    const items = sortedItems.slice(startIndex, startIndex + filter.pageSize);

    return {
      items,
      page: currentPage,
      pageSize: filter.pageSize,
      totalItems,
      totalPages,
      totalDeliveries,
    };
  }

  async updateOrder(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const updateOrder = await this.prisma.orderDelivery.update({
      where: { id: Number(id) },
      data: {
        amount: Number(info.amount),
        quantity: info.quantity,
        ...(info.status && { status: info.status }),
      },
    });
    return updateOrder as unknown as OrderDeliveryModel;
  }

  async deleteById(id: number): Promise<string> {
    const deleteOneOrderDelivery = await this.prisma.orderDelivery.delete({
      where: { id: Number(id) },
    });
    return "Deletado com Sucesso";
  }
}
