import { prisma } from "../../../infra/db/prisma/client";
import { GlobalSearchMysqlRepository } from "../../../infra/db/mysql/global-search-repository/global-search-repository";

export const makeGlobalSearchRepository = (): GlobalSearchMysqlRepository => new GlobalSearchMysqlRepository(prisma);
