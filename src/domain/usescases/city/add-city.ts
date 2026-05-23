import { City } from "../../models/city/city-model";

export interface AddCityModel {
  name: string;
}

export interface AddCity {
  add(city: AddCityModel): Promise<City>;
}
