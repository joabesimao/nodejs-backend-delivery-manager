import { City } from "../../models/city/city-model";

export interface LoadCity {
  load(): Promise<City[]>;
}
