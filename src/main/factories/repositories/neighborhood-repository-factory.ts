import { prisma } from "../../../infra/db/prisma/client";
import { NeighborhoodMysqlRepository } from "../../../infra/db/prisma/neighborhood-repository/neighborhood-repository";

export const makeNeighborhoodRepository = (): NeighborhoodMysqlRepository => new NeighborhoodMysqlRepository(prisma);
