import { AddOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/add-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../../../data/protocols/db/order-delivery/delete-order-delivery";
import {
  LoadOrderDeliveryByIdRepository,
  LoadOrderDeliveryRepository,
} from "../../../../data/protocols/db/order-delivery/load-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { prisma } from "../helpers";

export class OrderDeliveryMySqlRepository
  implements
    AddOrderDeliveryRepository,
    LoadOrderDeliveryRepository,
    LoadOrderDeliveryByIdRepository,
    DeleteOrderDeliveryByIdRepository
{
  async getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]> {
    const allOrderDelivery = await prisma.orderDelivery.findMany({
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
    const order = await prisma.orderDelivery.create({
      data: {
        registerId: orderOfDelivery.registerId,
        amount: orderOfDelivery.amount,
        data: new Date(),
        quantity: orderOfDelivery.quantity,
      },
    });
    return order as unknown as OrderDeliveryModel;
  }

  async getOneOrderOfDelivery(id: number): Promise<OrderDeliveryModel> {
    const orderById = await prisma.orderDelivery.findUnique({
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

  async deleteById(id: number): Promise<string> {
    const deleteOneOrderDelivery = await prisma.orderDelivery.delete({
      where: { id: Number(id) },
    });
    return "Deletado com Sucesso";
  }
}
