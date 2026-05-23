import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { LoadNeighborhood } from "../../../../domain/usescases/neighborhood/load-neighborhood";
import { LoadNeighborhoodRepository } from "../../../protocols/db/neighborhood/load-neighborhood";

export class DbLoadNeighborhood implements LoadNeighborhood {
  constructor(private readonly loadNeighborhoodRepository: LoadNeighborhoodRepository) {}
  async load(): Promise<Neighborhood[]> {
    return this.loadNeighborhoodRepository.loadAll();
  }
}
