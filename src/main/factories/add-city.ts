import { Controller } from "../../presentation/protocols/controller";
import { CityMysqlRepository } from "../../infra/db/mysql/city-repository/city-repository";
import { DbAddCity } from "../../data/usescases/city-usecases/add-city/db-add-city";
import { AddCityController } from "../../presentation/controllers/city-controllers/add-city/add-city";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddCityController = (): Controller => {
  const cityRepository = new CityMysqlRepository(prisma);
  const addCity = new DbAddCity(cityRepository);
  return new AddCityController(addCity);
};
