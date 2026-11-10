import { Controller } from "../../presentation/protocols/controller";
import { DbUpdateCity } from "../../data/usescases/city-usecases/update-city/db-update-city";
import { UpdateCityController } from "../../presentation/controllers/city-controllers/update-city/update-city";
import { makeCityRepository } from "./repositories";

export const makeUpdateCityController = (): Controller => {
  const cityRepository = makeCityRepository();
  const updateCity = new DbUpdateCity(cityRepository);
  return new UpdateCityController(updateCity);
};
