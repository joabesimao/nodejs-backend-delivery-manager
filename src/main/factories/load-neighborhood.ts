import { Controller } from "../../presentation/protocols/controller";
import { DbLoadNeighborhood } from "../../data/usescases/neighborhood-usecases/load-neighborhood/db-load-neighborhood";
import { LoadNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/load-neighborhood/load-neighborhood";
import { makeNeighborhoodRepository } from "./repositories";

export const makeLoadNeighborhoodController = (): Controller => {
  const neighborhoodRepository = makeNeighborhoodRepository();
  const loadNeighborhood = new DbLoadNeighborhood(neighborhoodRepository);
  return new LoadNeighborhoodController(loadNeighborhood);
};
