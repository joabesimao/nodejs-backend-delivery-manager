import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteCity } from "../../data/usescases/city-usecases/delete-city/db-delete-city";
import { DeleteCityController } from "../../presentation/controllers/city-controllers/delete-city/delete-city";
import { makeCityRepository } from "./repositories";

export const makeDeleteCityController = (): Controller => {
  const cityRepository = makeCityRepository();
  const deleteCity = new DbDeleteCity(cityRepository);
  return new DeleteCityController(deleteCity);
};
