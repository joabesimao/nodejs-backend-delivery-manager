import { PrismaClient } from "@prisma/client";
import { AddDeliverymanRepository } from "../../../../data/protocols/db/deliveryman/add-deliveryman";
import { DeleteDeliverymanRepository } from "../../../../data/protocols/db/deliveryman/delete-deliveryman";
import { LoadDeliverymanRepository } from "../../../../data/protocols/db/deliveryman/load-deliveryman";
import { UpdateDeliverymanRepository } from "../../../../data/protocols/db/deliveryman/update-deliveryman";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { AddDeliverymanModel } from "../../../../domain/usescases/deliveryman/add-deliveryman";

export class DeliverymanMysqlRepository
  implements LoadDeliverymanRepository, AddDeliverymanRepository, UpdateDeliverymanRepository, DeleteDeliverymanRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Deliveryman[]> {
    return this.prisma.deliveryman.findMany({
      orderBy: [{ name: "asc" }, { lastName: "asc" }],
    });
  }

  async loadOne(id: number): Promise<Deliveryman> {
    return this.prisma.deliveryman.findUnique({
      where: { id: Number(id) },
    });
  }

  async add(deliveryman: AddDeliverymanModel): Promise<Deliveryman> {
    return this.prisma.deliveryman.create({
      data: {
        name: deliveryman.name,
        lastName: deliveryman.lastName,
        numberQualification: deliveryman.numberQualification,
        phone: deliveryman.phone,
      },
    });
  }

  async update(id: number, data: Partial<Deliveryman>): Promise<Deliveryman> {
    return this.prisma.deliveryman.update({
      where: { id: Number(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phone && { phone: data.phone }),
        ...(data.numberQualification && { numberQualification: data.numberQualification }),
      },
    });
  }

  async deleteOne(id: number): Promise<string> {
    await this.prisma.deliveryman.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }
}
