import { Controller } from "../../presentation/protocols/controller";
import { NeighborhoodMysqlRepository } from "../../infra/db/mysql/neighborhood-repository/neighborhood-repository";
import { DbAddNeighborhood } from "../../data/usescases/neighborhood-usecases/add-neighborhood/db-add-neighborhood";
import { AddNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/add-neighborhood/add-neighborhood";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddNeighborhoodController = (): Controller => {
  const neighborhoodRepository = new NeighborhoodMysqlRepository(prisma);
  const addNeighborhood = new DbAddNeighborhood(neighborhoodRepository);
  return new AddNeighborhoodController(addNeighborhood);
};
