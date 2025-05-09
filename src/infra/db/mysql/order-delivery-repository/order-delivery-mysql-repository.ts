import { AddOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/add-order-delivery";
import { LoadOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/load-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { prisma } from "../helpers";

export class OrderDeliveryMySqlRepository
  implements AddOrderDeliveryRepository, LoadOrderDeliveryRepository
{
  async getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]> {
    const allOrderDelivery = await prisma.orderDelivery.findMany({
      include: {
        register: {
          include: {
            client: {
              include: {
                address: true,
              },
            },
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
        register: {
          connect: {
            id: orderOfDelivery.registerId,
          },
        },
        amount: orderOfDelivery.amount,
        data: new Date(),
        quantity: orderOfDelivery.quantity,
      },
    });
    return order as unknown as OrderDeliveryModel;
  }
}
