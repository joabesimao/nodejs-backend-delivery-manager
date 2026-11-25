import { DeleteCity } from "../../../../domain/usecases/city/delete-city";
import { DeleteCityRepository } from "../../../protocols/db/city/delete-city";

export class DbDeleteCity implements DeleteCity {
  constructor(private readonly deleteCityRepository: DeleteCityRepository) {}

  async delete(id: number): Promise<string> {
    return await this.deleteCityRepository.deleteOne(id);
  }
}
