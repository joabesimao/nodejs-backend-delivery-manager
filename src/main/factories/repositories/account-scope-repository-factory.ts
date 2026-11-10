import { prisma } from "../../../infra/db/prisma/client";
import { AccountScopeMysqlRepository } from "../../../infra/db/mysql/account-scope-repository/account-scope-repository";

export const makeAccountScopeRepository = (): AccountScopeMysqlRepository => new AccountScopeMysqlRepository(prisma);
