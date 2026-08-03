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
  async getAllOrderOfDelivery(
    accountId?: number,
  ): Promise<OrderDeliveryModel[]> {
    const scope = accountId
      ? await getAccountScope(this.prisma, accountId)
      : null;

    const allOrderDelivery = await this.prisma.orderDelivery.findMany({
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

    return allOrderDelivery as unknown as OrderDeliveryModel[];
  }
  async addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel,
  ): Promise<OrderDeliveryModel> {
    const registerExists = await this.prisma.register.findUnique({
      where: { id: Number(orderOfDelivery.registerId) },
      select: { id: true },
    });

    if (!registerExists) {
      throw new Error("Cadastro nao encontrado");
    }

    if (orderOfDelivery.deliverymanId) {
      const deliverymanExists = await this.prisma.deliveryman.findUnique({
        where: { id: Number(orderOfDelivery.deliverymanId) },
        select: { id: true },
      });

      if (!deliverymanExists) {
        throw new Error("Entregador nao encontrado");
      }
    }

    const scope = orderOfDelivery.accountId
      ? await getAccountScope(this.prisma, orderOfDelivery.accountId)
      : null;

    let scopedUnitStoreId: number | null = null;

    if (scope?.unitStoreId) {
      const unitStoreExists = await this.prisma.unitStore.findUnique({
        where: { id: scope.unitStoreId },
        select: { id: true },
      });

      if (!unitStoreExists) {
        throw new Error("Conta vinculada a loja inexistente");
      }

      scopedUnitStoreId = scope.unitStoreId;
    }

    const order = await this.prisma.orderDelivery.create({
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
        receivedAt: new Date(),
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

    const rootStoreId = order.unitStoreId
      ? await resolveRootStoreId(this.prisma, order.unitStoreId)
      : null;

    emitDeliveryRealtime({
      eventType: "created",
      unitStoreId: order.unitStoreId ?? null,
      rootStoreId,
      order,
    });

    return order as unknown as OrderDeliveryModel;
  }

  async getOneOrderOfDelivery(
    id: number,
    accountId?: number,
  ): Promise<OrderDeliveryModel> {
    const orderById = await this.prisma.orderDelivery.findUnique({
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

    if (!orderById) {
      return null as unknown as OrderDeliveryModel;
    }

    if (accountId) {
      const scope = await getAccountScope(this.prisma, accountId);

      if (
        scope &&
        scope.visibleUnitIds.length > 0 &&
        orderById.unitStoreId &&
        !scope.visibleUnitIds.includes(orderById.unitStoreId)
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

    const deliveries = await this.prisma.orderDelivery.findMany({
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
    const existingOrder = await this.prisma.orderDelivery.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        unitStoreId: true,
      },
    });

    if (!existingOrder) {
      throw new Error("Pedido nao encontrado");
    }

    if (info.accountId) {
      const scope = await getAccountScope(this.prisma, info.accountId);

      if (
        scope &&
        scope.visibleUnitIds.length > 0 &&
        existingOrder.unitStoreId &&
        !scope.visibleUnitIds.includes(existingOrder.unitStoreId)
      ) {
        throw new Error("Sem permissao para atualizar entrega dessa loja");
      }
    }

    const updateOrder = await this.prisma.orderDelivery.update({
      where: { id: Number(id) },
      data: {
        amount: Number(info.amount),
        quantity: info.quantity,
        ...(info.status === "finished" && {
          finishedAt: new Date(),
        }),
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

    const rootStoreId = updateOrder.unitStoreId
      ? await resolveRootStoreId(this.prisma, updateOrder.unitStoreId)
      : null;

    emitDeliveryRealtime({
      eventType: "updated",
      unitStoreId: updateOrder.unitStoreId ?? null,
      rootStoreId,
      order: updateOrder,
    });

    return updateOrder as unknown as OrderDeliveryModel;
  }

  async deleteById(id: number, accountId?: number): Promise<string> {
    const existingOrder = await this.prisma.orderDelivery.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        unitStoreId: true,
      },
    });

    if (!existingOrder) {
      throw new Error("Pedido nao encontrado");
    }

    if (accountId) {
      const scope = await getAccountScope(this.prisma, accountId);

      if (
        scope &&
        scope.visibleUnitIds.length > 0 &&
        existingOrder.unitStoreId &&
        !scope.visibleUnitIds.includes(existingOrder.unitStoreId)
      ) {
        throw new Error("Sem permissao para deletar entrega dessa loja");
      }
    }

    await this.prisma.orderDelivery.delete({
      where: { id: Number(id) },
    });

    const rootStoreId = existingOrder?.unitStoreId
      ? await resolveRootStoreId(this.prisma, existingOrder.unitStoreId)
      : null;

    emitDeliveryRealtime({
      eventType: "deleted",
      unitStoreId: existingOrder?.unitStoreId ?? null,
      rootStoreId,
      order: {
        id: Number(id),
      },
    });

    return "Deletado com Sucesso";
  }
}
