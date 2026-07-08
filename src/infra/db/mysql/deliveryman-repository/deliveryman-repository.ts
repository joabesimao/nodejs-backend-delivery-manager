import { PrismaClient } from "@prisma/client";
import { AddDeliverymanRepository } from "../../../../data/protocols/db/deliveryman/add-deliveryman";
import { LoadDeliverymanRepository } from "../../../../data/protocols/db/deliveryman/load-deliveryman";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { AddDeliverymanModel } from "../../../../domain/usescases/deliveryman/add-deliveryman";

export class DeliverymanMysqlRepository
  implements LoadDeliverymanRepository, AddDeliverymanRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Deliveryman[]> {
    return this.prisma.deliveryman.findMany({
      orderBy: [{ name: "asc" }, { lastName: "asc" }],
    });
  }

  async add(deliveryman: AddDeliverymanModel): Promise<Deliveryman> {
    return this.prisma.deliveryman.create({
      data: {
        name: deliveryman.name,
        lastName: deliveryman.lastName,
        phone: deliveryman.phone,
      },
    });
  }
}
