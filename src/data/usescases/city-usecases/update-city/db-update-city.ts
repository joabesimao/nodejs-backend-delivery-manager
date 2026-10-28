import { City } from "../../../../domain/models/city/city-model";
import { UpdateCity, UpdateCityModel } from "../../../../domain/usescases/city/update-city";
import { UpdateCityRepository } from "../../../protocols/db/city/update-city";

export class DbUpdateCity implements UpdateCity {
  constructor(private readonly updateCityRepository: UpdateCityRepository) {}

  async update(id: number, data: UpdateCityModel): Promise<City> {
    return await this.updateCityRepository.update(id, data);
  }
}
