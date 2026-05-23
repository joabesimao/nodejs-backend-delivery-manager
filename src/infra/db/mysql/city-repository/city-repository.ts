import { PrismaClient } from "@prisma/client";
import { AddCityRepository } from "../../../../data/protocols/db/city/add-city";
import { LoadCityRepository } from "../../../../data/protocols/db/city/load-city";
import { City } from "../../../../domain/models/city/city-model";
import { AddCityModel } from "../../../../domain/usescases/city/add-city";

export class CityMysqlRepository implements LoadCityRepository, AddCityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<City[]> {
    return this.prisma.city.findMany({
      orderBy: { name: "asc" },
    });
  }

  async add(city: AddCityModel): Promise<City> {
    return this.prisma.city.create({ data: { name: city.name } });
  }
}
