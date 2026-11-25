import { Neighborhood } from "../../models/neighborhood/neighborhood-model";

export interface LoadNeighborhood {
  load(): Promise<Neighborhood[]>;
}
