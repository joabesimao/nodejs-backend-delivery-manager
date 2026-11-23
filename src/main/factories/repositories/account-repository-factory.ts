import { prisma } from "../../../infra/db/prisma/client";
import { AccountMySqlRepository } from "../../../infra/db/prisma/account-repository/account-repository";

export const makeAccountRepository = (): AccountMySqlRepository => new AccountMySqlRepository(prisma);
