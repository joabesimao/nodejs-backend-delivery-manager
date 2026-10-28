import { PrismaClient } from "@prisma/client";
import { AddCityRepository } from "../../../../data/protocols/db/city/add-city";
import { DeleteCityRepository } from "../../../../data/protocols/db/city/delete-city";
import { LoadCityRepository } from "../../../../data/protocols/db/city/load-city";
import { UpdateCityRepository } from "../../../../data/protocols/db/city/update-city";
import { City } from "../../../../domain/models/city/city-model";
import { AddCityModel } from "../../../../domain/usescases/city/add-city";

export class CityMysqlRepository
  implements LoadCityRepository, AddCityRepository, UpdateCityRepository, DeleteCityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<City[]> {
    return await this.prisma.city.findMany({
      orderBy: { name: "asc" },
    });
  }

  async add(city: AddCityModel): Promise<City> {
    return await this.prisma.city.create({ data: { name: city.name } });
  }

  async update(id: number, data: Partial<City>): Promise<City> {
    return await this.prisma.city.update({
      where: { id: Number(id) },
      data: {
        ...(data.name && { name: data.name }),
      },
    });
  }

  async deleteOne(id: number): Promise<string> {
    await this.prisma.city.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }
}
