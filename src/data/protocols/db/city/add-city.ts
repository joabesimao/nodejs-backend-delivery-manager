import { City } from "../../../../domain/models/city/city-model";
import { AddCityModel } from "../../../../domain/usescases/city/add-city";

export interface AddCityRepository {
  add(city: AddCityModel): Promise<City>;
}
