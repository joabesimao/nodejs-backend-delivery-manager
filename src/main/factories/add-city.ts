import { Controller } from "../../presentation/protocols/controller";
import { DbAddCity } from "../../data/usescases/city-usecases/add-city/db-add-city";
import { AddCityController } from "../../presentation/controllers/city-controllers/add-city/add-city";
import { makeCityRepository } from "./repositories";

export const makeAddCityController = (): Controller => {
  const cityRepository = makeCityRepository();
  const addCity = new DbAddCity(cityRepository);
  return new AddCityController(addCity);
};
