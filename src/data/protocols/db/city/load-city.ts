import { City } from "../../../../domain/models/city/city-model";

export interface LoadCityRepository {
  loadAll(): Promise<City[]>;
}
