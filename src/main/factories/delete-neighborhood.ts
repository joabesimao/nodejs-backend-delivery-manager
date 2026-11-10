import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteNeighborhood } from "../../data/usescases/neighborhood-usecases/delete-neighborhood/db-delete-neighborhood";
import { DeleteNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/delete-neighborhood/delete-neighborhood";
import { makeNeighborhoodRepository } from "./repositories";

export const makeDeleteNeighborhoodController = (): Controller => {
  const neighborhoodRepository = makeNeighborhoodRepository();
  const deleteNeighborhood = new DbDeleteNeighborhood(neighborhoodRepository);
  return new DeleteNeighborhoodController(deleteNeighborhood);
};
