import { Controller } from "../../presentation/protocols/controller";
import { CityMysqlRepository } from "../../infra/db/mysql/city-repository/city-repository";
import { DbDeleteCity } from "../../data/usescases/city-usecases/delete-city/db-delete-city";
import { DeleteCityController } from "../../presentation/controllers/city-controllers/delete-city/delete-city";
import { prisma } from "../../infra/db/prisma/client";

export const makeDeleteCityController = (): Controller => {
  const cityRepository = new CityMysqlRepository(prisma);
  const deleteCity = new DbDeleteCity(cityRepository);
  return new DeleteCityController(deleteCity);
};
