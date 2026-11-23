import { PrismaClient } from "@prisma/client";
import {
  GlobalSearchOrderRow,
  GlobalSearchRepository,
} from "../../../../data/protocols/db/search/global-search-repository";
import { GlobalSearchResult } from "../../../../domain/models/search/global-search";

const contains = (term: string) => ({ contains: term, mode: "insensitive" as const });

export class GlobalSearchMysqlRepository implements GlobalSearchRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async searchOrders(
    term: string,
    orderId: number | undefined,
    limit: number,
  ): Promise<GlobalSearchOrderRow[]> {
    const orders = await this.prisma.orderDelivery.findMany({
      where: {
        OR: [
          ...(orderId !== undefined ? [{ id: orderId }] : []),
          { Register: { client: { name: contains(term) } } },
          { deliveryman: { name: contains(term) } },
          { deliveryman: { lastName: contains(term) } },
        ],
      },
      include: {
        deliveryman: true,
        Register: { include: { client: true, address: true } },
      },
      orderBy: { data: "desc" },
      take: limit,
    });
    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      amount: order.amount,
      clientName: order.Register?.client?.name ?? null,
      deliveryman: order.deliveryman,
    }));
  }

  async searchClients(term: string, limit: number): Promise<GlobalSearchResult["clients"]> {
    const clients = await this.prisma.client.findMany({
      where: {
        OR: [{ name: contains(term) }, { cpf: contains(term) }, { phone: contains(term) }],
      },
      take: limit,
    });
    return clients.map((client) => ({
      id: client.id,
      name: client.name,
      cpf: client.cpf,
      phone: client.phone,
    }));
  }

  async searchDeliverymen(term: string, limit: number): Promise<GlobalSearchResult["deliverymen"]> {
    const deliverymen = await this.prisma.deliveryman.findMany({
      where: {
        OR: [{ name: contains(term) }, { lastName: contains(term) }, { phone: contains(term) }],
      },
      take: limit,
    });
    return deliverymen.map((deliveryman) => ({
      id: deliveryman.id,
      name: deliveryman.name,
      lastName: deliveryman.lastName,
      phone: deliveryman.phone,
    }));
  }
}
