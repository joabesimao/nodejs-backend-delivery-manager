import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { AddNeighborhood, AddNeighborhoodModel } from "../../../../domain/usescases/neighborhood/add-neighborhood";
import { AddNeighborhoodRepository } from "../../../protocols/db/neighborhood/add-neighborhood";

export class DbAddNeighborhood implements AddNeighborhood {
  constructor(private readonly addNeighborhoodRepository: AddNeighborhoodRepository) {}
  async add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood> {
    return this.addNeighborhoodRepository.add(neighborhood);
  }
}
