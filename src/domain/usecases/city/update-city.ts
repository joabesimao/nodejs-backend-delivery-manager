import { City } from "../../models/city/city-model";

export interface UpdateCityModel {
  name?: string;
}

export interface UpdateCity {
  update(id: number, data: UpdateCityModel): Promise<City>;
}
