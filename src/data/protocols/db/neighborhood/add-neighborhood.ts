import { Neighborhood } from "../../../../domain/models/neighborhood/neighborhood-model";
import { AddNeighborhoodModel } from "../../../../domain/usescases/neighborhood/add-neighborhood";

export interface AddNeighborhoodRepository {
  add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood>;
}
