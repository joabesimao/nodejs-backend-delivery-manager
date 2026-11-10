import { Controller } from "../../presentation/protocols/controller";
import { DbLoadCity } from "../../data/usescases/city-usecases/load-city/db-load-city";
import { LoadCityController } from "../../presentation/controllers/city-controllers/load-city/load-city";
import { makeCityRepository } from "./repositories";

export const makeLoadCityController = (): Controller => {
  const cityRepository = makeCityRepository();
  const loadCity = new DbLoadCity(cityRepository);
  return new LoadCityController(loadCity);
};
