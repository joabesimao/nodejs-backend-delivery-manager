import { prisma } from "../../../infra/db/prisma/client";
import { NeighborhoodMysqlRepository } from "../../../infra/db/mysql/neighborhood-repository/neighborhood-repository";

export const makeNeighborhoodRepository = (): NeighborhoodMysqlRepository => new NeighborhoodMysqlRepository(prisma);
