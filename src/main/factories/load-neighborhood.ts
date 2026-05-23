import { Controller } from "../../presentation/protocols/controller";
import { NeighborhoodMysqlRepository } from "../../infra/db/mysql/neighborhood-repository/neighborhood-repository";
import { DbLoadNeighborhood } from "../../data/usescases/neighborhood-usecases/load-neighborhood/db-load-neighborhood";
import { LoadNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/load-neighborhood/load-neighborhood";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadNeighborhoodController = (): Controller => {
  const neighborhoodRepository = new NeighborhoodMysqlRepository(prisma);
  const loadNeighborhood = new DbLoadNeighborhood(neighborhoodRepository);
  return new LoadNeighborhoodController(loadNeighborhood);
};
