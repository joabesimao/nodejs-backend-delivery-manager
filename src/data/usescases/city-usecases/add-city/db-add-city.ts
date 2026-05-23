import { City } from "../../../../domain/models/city/city-model";
import { AddCity, AddCityModel } from "../../../../domain/usescases/city/add-city";
import { AddCityRepository } from "../../../protocols/db/city/add-city";

export class DbAddCity implements AddCity {
  constructor(private readonly addCityRepository: AddCityRepository) {}
  async add(city: AddCityModel): Promise<City> {
    return this.addCityRepository.add(city);
  }
}
