import { prisma } from "../../../infra/db/prisma/client";
import { AddAccountMySqlRepository } from "../../../infra/db/prisma/signup-repository/signup-repository";

export const makeAddAccountRepository = (): AddAccountMySqlRepository => new AddAccountMySqlRepository(prisma);
