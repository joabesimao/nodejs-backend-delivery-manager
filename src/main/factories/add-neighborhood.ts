import { Controller } from "../../presentation/protocols/controller";
import { DbAddNeighborhood } from "../../data/usescases/neighborhood-usecases/add-neighborhood/db-add-neighborhood";
import { AddNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/add-neighborhood/add-neighborhood";
import { makeNeighborhoodRepository } from "./repositories";

export const makeAddNeighborhoodController = (): Controller => {
  const neighborhoodRepository = makeNeighborhoodRepository();
  const addNeighborhood = new DbAddNeighborhood(neighborhoodRepository);
  return new AddNeighborhoodController(addNeighborhood);
};
