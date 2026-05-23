import { Neighborhood } from "../../models/neighborhood/neighborhood-model";

export interface AddNeighborhoodModel {
  name: string;
  cityId: number;
}

export interface AddNeighborhood {
  add(neighborhood: AddNeighborhoodModel): Promise<Neighborhood>;
}
