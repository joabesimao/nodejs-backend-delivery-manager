import { PrismaClient } from "@prisma/client";
import { AddNeighborhoodRepository } from "../../../../data/protocols/db/neighborhood/add-neighborhood";
import { DeleteNeighborhoodRepository } from "../../../../data/protocols/db/neighborhood/delete-neighborhood";
import { LoadNeighborhoodRepository } from "../../../../data/protocols/db/neighborhood/load-neighborhood";
import { UpdateNeighborhoodRepository } from "../../../../data/protocols/db/neighborhood/update-neighborhood";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { AddNeighborhoodModel } from "../../../../domain/usescases/neighborhood/add-neighborhood";

export class NeighborhoodMysqlRepository
  implements LoadNeighborhoodRepository, AddNeighborhoodRepository, UpdateNeighborhoodRepository, DeleteNeighborhoodRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Neighborhood[]> {
    return await this.prisma.neighborhood.findMany({
      orderBy: { name: "asc" },
      include: { city: true },
    });
  }

  async add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood> {
    return await this.prisma.neighborhood.create({
      data: { name: neighborhood.name, cityId: neighborhood.cityId },
    });
  }

  async update(id: number, data: Partial<Neighborhood>): Promise<Neighborhood> {
    return await this.prisma.neighborhood.update({
      where: { id: Number(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.cityId && { cityId: data.cityId }),
      },
      include: { city: true },
    });
  }

  async deleteOne(id: number): Promise<string> {
    await this.prisma.neighborhood.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }
}
