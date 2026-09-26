import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import {
  UpdateNeighborhood,
  UpdateNeighborhoodModel,
} from "../../../../domain/usescases/neighborhood/update-neighborhood";
import { UpdateNeighborhoodRepository } from "../../../protocols/db/neighborhood/update-neighborhood";

export class DbUpdateNeighborhood implements UpdateNeighborhood {
  constructor(private readonly updateNeighborhoodRepository: UpdateNeighborhoodRepository) {}

  async update(id: number, data: UpdateNeighborhoodModel): Promise<Neighborhood> {
    return await this.updateNeighborhoodRepository.update(id, data);
  }
}
