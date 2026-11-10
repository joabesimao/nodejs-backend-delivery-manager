import { prisma } from "../../../infra/db/prisma/client";
import { ClientMysqlRepository } from "../../../infra/db/mysql/client-repository/client-repository";

export const makeClientRepository = (): ClientMysqlRepository => new ClientMysqlRepository(prisma);
