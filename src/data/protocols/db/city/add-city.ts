import { City } from "../../../../domain/models/city/city-model";
import { AddCityModel } from "../../../../domain/usecases/city/add-city";

export interface AddCityRepository {
  add(city: AddCityModel): Promise<City>;
}
