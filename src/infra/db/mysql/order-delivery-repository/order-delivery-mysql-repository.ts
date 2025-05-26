import { PrismaClient } from "@prisma/client";
import { AddOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/add-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../../../data/protocols/db/order-delivery/delete-order-delivery";
import {
  LoadOrderDeliveryByIdRepository,
  LoadOrderDeliveryRepository,
} from "../../../../data/protocols/db/order-delivery/load-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/add-order-delivery";

export class OrderDeliveryMySqlRepository
  implements
    AddOrderDeliveryRepository,
    LoadOrderDeliveryRepository,
    LoadOrderDeliveryByIdRepository,
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

  async updateOrder(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const updateOrder = await this.prisma.orderDelivery.update({
      where: { id: Number(id) },
      data: { amount: Number(info.amount), quantity: info.quantity },
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
