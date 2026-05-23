import { City } from "../../../../domain/models/city/city-model";
import { LoadCity } from "../../../../domain/usescases/city/load-city";
import { LoadCityRepository } from "../../../protocols/db/city/load-city";

export class DbLoadCity implements LoadCity {
  constructor(private readonly loadCityRepository: LoadCityRepository) {}
  async load(): Promise<City[]> {
    return this.loadCityRepository.loadAll();
  }
}
