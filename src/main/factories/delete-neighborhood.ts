import { Controller } from "../../presentation/protocols/controller";
import { NeighborhoodMysqlRepository } from "../../infra/db/mysql/neighborhood-repository/neighborhood-repository";
import { DbDeleteNeighborhood } from "../../data/usescases/neighborhood-usecases/delete-neighborhood/db-delete-neighborhood";
import { DeleteNeighborhoodController } from "../../presentation/controllers/neighborhood-controllers/delete-neighborhood/delete-neighborhood";
import { prisma } from "../../infra/db/prisma/client";

export const makeDeleteNeighborhoodController = (): Controller => {
  const neighborhoodRepository = new NeighborhoodMysqlRepository(prisma);
  const deleteNeighborhood = new DbDeleteNeighborhood(neighborhoodRepository);
  return new DeleteNeighborhoodController(deleteNeighborhood);
};
