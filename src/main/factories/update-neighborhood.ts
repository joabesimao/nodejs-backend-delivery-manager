import { Controller } from "../../presentation/protocols/controller";
import { DbUpdateNeighborhood } from "../../data/usescases/neighborhood-usecases/update-neighborhood/db-update-neighborhood";
import { UpdateNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/update-neighborhood/update-neighborhood";
import { makeNeighborhoodRepository } from "./repositories";

export const makeUpdateNeighborhoodController = (): Controller => {
  const neighborhoodRepository = makeNeighborhoodRepository();
  const updateNeighborhood = new DbUpdateNeighborhood(neighborhoodRepository);
  return new UpdateNeighborhoodController(updateNeighborhood);
};
