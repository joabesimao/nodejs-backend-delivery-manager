import { OrderStatus, Prisma, PrismaClient } from "@prisma/client";
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
import { emitDeliveryRealtime } from "../../../../main/realtime/realtime-state";
import {
  getAccountScope,
  resolveRootStoreId,
} from "../../../../main/realtime/store-scope";

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

  private isMissingUnitStoreColumn(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      return false;
    }

    if (error.code !== "P2022") {
      return false;
    }

    const column = String(error.meta?.column ?? "").toLowerCase();
    return column.includes("unitstoreid");
  }

  async getAllOrderOfDelivery(
    accountId?: number,
  ): Promise<OrderDeliveryModel[]> {
    const scope = accountId
      ? await getAccountScope(this.prisma, accountId)
      : null;

    let allOrderDelivery;
    try {
      allOrderDelivery = await this.prisma.orderDelivery.findMany({
        where:
          scope && scope.visibleUnitIds.length > 0
            ? {
                unitStoreId: {
                  in: scope.visibleUnitIds,
                },
              }
            : undefined,
        include: {
          unitStore: true,
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      allOrderDelivery = await this.prisma.orderDelivery.findMany({
        include: {
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });
    }

    return allOrderDelivery as unknown as OrderDeliveryModel[];
  }
  async addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel,
  ): Promise<OrderDeliveryModel> {
    const scope = orderOfDelivery.accountId
      ? await getAccountScope(this.prisma, orderOfDelivery.accountId)
      : null;

    const scopedUnitStoreId = scope?.unitStoreId ?? null;

    let order;
    let rootStoreId: number | null = null;

    try {
      order = await this.prisma.orderDelivery.create({
        data: {
          registerId: orderOfDelivery.registerId,
          ...(scopedUnitStoreId
            ? {
                unitStoreId: scopedUnitStoreId,
              }
            : {}),
          ...(orderOfDelivery.deliverymanId && {
            deliverymanId: Number(orderOfDelivery.deliverymanId),
          }),
          amount: Number(orderOfDelivery.amount),
          data: new Date(),
          quantity: orderOfDelivery.quantity,
        },
        include: {
          unitStore: true,
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });

      rootStoreId = order.unitStoreId
        ? await resolveRootStoreId(this.prisma, order.unitStoreId)
        : null;
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      order = await this.prisma.orderDelivery.create({
        data: {
          registerId: orderOfDelivery.registerId,
          ...(orderOfDelivery.deliverymanId && {
            deliverymanId: Number(orderOfDelivery.deliverymanId),
          }),
          amount: Number(orderOfDelivery.amount),
          data: new Date(),
          quantity: orderOfDelivery.quantity,
        },
        include: {
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });
    }

    emitDeliveryRealtime({
      eventType: "created",
      unitStoreId:
        (order as { unitStoreId?: number | null }).unitStoreId ?? null,
      rootStoreId,
      order,
    });

    return order as unknown as OrderDeliveryModel;
  }

  async getOneOrderOfDelivery(
    id: number,
    accountId?: number,
  ): Promise<OrderDeliveryModel> {
    let orderById;
    try {
      orderById = await this.prisma.orderDelivery.findUnique({
        where: { id: Number(id) },
        include: {
          unitStore: true,
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      orderById = await this.prisma.orderDelivery.findUnique({
        where: { id: Number(id) },
        include: {
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });
    }

    if (!orderById) {
      return null as unknown as OrderDeliveryModel;
    }

    if (accountId) {
      const scope = await getAccountScope(this.prisma, accountId);

      const orderUnitStoreId =
        (orderById as { unitStoreId?: number | null }).unitStoreId ?? null;

      if (
        scope &&
        scope.visibleUnitIds.length > 0 &&
        orderUnitStoreId &&
        !scope.visibleUnitIds.includes(orderUnitStoreId)
      ) {
        throw new Error("Sem permissao para visualizar entrega dessa loja");
      }
    }

    return orderById as unknown as OrderDeliveryModel;
  }

  async getDeliverymanRankingByPeriod(
    filter: DeliveryRankingFilter,
  ): Promise<DeliveryRankingPaginatedModel> {
    const scope = filter.accountId
      ? await getAccountScope(this.prisma, filter.accountId)
      : null;

    const statusFilter: OrderStatus[] =
      filter.status === "all" || !filter.status
        ? [OrderStatus.delivered, OrderStatus.finished]
        : [filter.status as OrderStatus];

    let deliveries;
    try {
      deliveries = await this.prisma.orderDelivery.findMany({
        where: {
          data: {
            gte: filter.startDate,
            lte: filter.endDate,
          },
          status: {
            in: statusFilter,
          },
          ...(scope && scope.visibleUnitIds.length > 0
            ? {
                unitStoreId: {
                  in: scope.visibleUnitIds,
                },
              }
            : {}),
        },
        include: {
          deliveryman: true,
          Register: {
            include: {
              client: true,
            },
          },
        },
      });
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      deliveries = await this.prisma.orderDelivery.findMany({
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
          deliveryman: true,
          Register: {
            include: {
              client: true,
            },
          },
        },
      });
    }

    const totalsByDeliveryman = new Map<number, DeliveryRankingModel>();

    for (const delivery of deliveries) {
      if (!delivery.deliverymanId || !delivery.deliveryman) {
        continue;
      }

      const deliverymanId = delivery.deliverymanId;
      const current = totalsByDeliveryman.get(deliverymanId);
      const deliverymanName =
        `${delivery.deliveryman.name} ${delivery.deliveryman.lastName}`.trim();

      if (!current) {
        totalsByDeliveryman.set(deliverymanId, {
          deliverymanId,
          deliverymanName,
          totalDeliveries: 1,
        });
        continue;
      }

      current.totalDeliveries += 1;
    }

    const sortedItems = Array.from(totalsByDeliveryman.values()).sort(
      (a, b) =>
        b.totalDeliveries - a.totalDeliveries ||
        a.deliverymanName.localeCompare(b.deliverymanName),
    );

    const totalItems = sortedItems.length;
    const totalDeliveries = sortedItems.reduce(
      (sum, item) => sum + item.totalDeliveries,
      0,
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
    info: UpdateOrderDeliveryModel,
  ): Promise<OrderDeliveryModel> {
    let existingOrder;
    let withUnitStoreColumn = true;
    try {
      existingOrder = await this.prisma.orderDelivery.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          unitStoreId: true,
        },
      });
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      withUnitStoreColumn = false;
      existingOrder = await this.prisma.orderDelivery.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
        },
      });
    }

    if (!existingOrder) {
      throw new Error("Pedido nao encontrado");
    }

    if (info.accountId) {
      const scope = await getAccountScope(this.prisma, info.accountId);

      const orderUnitStoreId = withUnitStoreColumn
        ? ((existingOrder as { unitStoreId?: number | null }).unitStoreId ??
          null)
        : null;

      if (
        scope &&
        scope.visibleUnitIds.length > 0 &&
        orderUnitStoreId &&
        !scope.visibleUnitIds.includes(orderUnitStoreId)
      ) {
        throw new Error("Sem permissao para atualizar entrega dessa loja");
      }
    }

    let updateOrder;
    let rootStoreId: number | null = null;
    try {
      updateOrder = await this.prisma.orderDelivery.update({
        where: { id: Number(id) },
        data: {
          amount: Number(info.amount),
          quantity: info.quantity,
          ...(info.deliverymanId && {
            deliverymanId: Number(info.deliverymanId),
          }),
          ...(info.status && { status: info.status }),
        },
        include: {
          unitStore: true,
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });

      rootStoreId = updateOrder.unitStoreId
        ? await resolveRootStoreId(this.prisma, updateOrder.unitStoreId)
        : null;
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      updateOrder = await this.prisma.orderDelivery.update({
        where: { id: Number(id) },
        data: {
          amount: Number(info.amount),
          quantity: info.quantity,
          ...(info.deliverymanId && {
            deliverymanId: Number(info.deliverymanId),
          }),
          ...(info.status && { status: info.status }),
        },
        include: {
          deliveryman: true,
          Register: {
            include: {
              client: true,
              address: true,
            },
          },
        },
      });
    }

    emitDeliveryRealtime({
      eventType: "updated",
      unitStoreId:
        (updateOrder as { unitStoreId?: number | null }).unitStoreId ?? null,
      rootStoreId,
      order: updateOrder,
    });

    return updateOrder as unknown as OrderDeliveryModel;
  }

  async deleteById(id: number, accountId?: number): Promise<string> {
    let existingOrder;
    let withUnitStoreColumn = true;
    try {
      existingOrder = await this.prisma.orderDelivery.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          unitStoreId: true,
        },
      });
    } catch (error) {
      if (!this.isMissingUnitStoreColumn(error)) {
        throw error;
      }

      withUnitStoreColumn = false;
      existingOrder = await this.prisma.orderDelivery.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
        },
      });
    }

    if (!existingOrder) {
      throw new Error("Pedido nao encontrado");
    }

    if (accountId) {
      const scope = await getAccountScope(this.prisma, accountId);

      const orderUnitStoreId = withUnitStoreColumn
        ? ((existingOrder as { unitStoreId?: number | null }).unitStoreId ??
          null)
        : null;

      if (
        scope &&
        scope.visibleUnitIds.length > 0 &&
        orderUnitStoreId &&
        !scope.visibleUnitIds.includes(orderUnitStoreId)
      ) {
        throw new Error("Sem permissao para deletar entrega dessa loja");
      }
    }

    await this.prisma.orderDelivery.delete({
      where: { id: Number(id) },
    });

    const existingOrderUnitStoreId = withUnitStoreColumn
      ? ((existingOrder as { unitStoreId?: number | null }).unitStoreId ?? null)
      : null;

    const rootStoreId = existingOrderUnitStoreId
      ? await resolveRootStoreId(this.prisma, existingOrderUnitStoreId)
      : null;

    emitDeliveryRealtime({
      eventType: "deleted",
      unitStoreId: existingOrderUnitStoreId,
      rootStoreId,
      order: {
        id: Number(id),
      },
    });

    return "Deletado com Sucesso";
  }
}
