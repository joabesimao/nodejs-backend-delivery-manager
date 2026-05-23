import { PrismaClient } from "@prisma/client";
import { AddNeighborhoodRepository } from "../../../../data/protocols/db/neighborhood/add-neighborhood";
import { LoadNeighborhoodRepository } from "../../../../data/protocols/db/neighborhood/load-neighborhood";
import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { AddNeighborhoodModel } from "../../../../domain/usescases/neighborhood/add-neighborhood";

export class NeighborhoodMysqlRepository implements LoadNeighborhoodRepository, AddNeighborhoodRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Neighborhood[]> {
    return this.prisma.neighborhood.findMany({
      orderBy: { name: "asc" },
      include: { city: true },
    });
  }

  async add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood> {
    return this.prisma.neighborhood.create({
      data: { name: neighborhood.name, cityId: neighborhood.cityId },
    });
  }
}
