import { Neighborhood } from "../../models/neighborhood/neighborhood-model";

export interface UpdateNeighborhoodModel {
  name?: string;
  cityId?: number;
}

export interface UpdateNeighborhood {
  update(id: number, data: UpdateNeighborhoodModel): Promise<Neighborhood>;
}
