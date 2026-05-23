import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";

export interface LoadNeighborhoodRepository {
  loadAll(): Promise<Neighborhood[]>;
}
