import { Controller } from "../../presentation/protocols/controller";
import { CityMysqlRepository } from "../../infra/db/mysql/city-repository/city-repository";
import { DbUpdateCity } from "../../data/usescases/city-usecases/update-city/db-update-city";
import { UpdateCityController } from "../../presentation/controllers/city-controllers/update-city/update-city";
import { prisma } from "../../infra/db/prisma/client";

export const makeUpdateCityController = (): Controller => {
  const cityRepository = new CityMysqlRepository(prisma);
  const updateCity = new DbUpdateCity(cityRepository);
  return new UpdateCityController(updateCity);
};
