import { Controller } from "../../presentation/protocols/controller";
import { NeighborhoodMysqlRepository } from "../../infra/db/mysql/neighborhood-repository/neighborhood-repository";
import { DbUpdateNeighborhood } from "../../data/usescases/neighborhood-usecases/update-neighborhood/db-update-neighborhood";
import { UpdateNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/update-neighborhood/update-neighborhood";
import { prisma } from "../../infra/db/prisma/client";

export const makeUpdateNeighborhoodController = (): Controller => {
  const neighborhoodRepository = new NeighborhoodMysqlRepository(prisma);
  const updateNeighborhood = new DbUpdateNeighborhood(neighborhoodRepository);
  return new UpdateNeighborhoodController(updateNeighborhood);
};
