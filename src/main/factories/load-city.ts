import { Controller } from "../../presentation/protocols/controller";
import { CityMysqlRepository } from "../../infra/db/mysql/city-repository/city-repository";
import { DbLoadCity } from "../../data/usescases/city-usecases/load-city/db-load-city";
import { LoadCityController } from "../../presentation/controllers/city-controllers/load-city/load-city";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadCityController = (): Controller => {
  const cityRepository = new CityMysqlRepository(prisma);
  const loadCity = new DbLoadCity(cityRepository);
  return new LoadCityController(loadCity);
};
