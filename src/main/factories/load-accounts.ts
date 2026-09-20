import { DbLoadAccounts } from "../../data/usescases/account-usecases/load-accounts/db-load-accounts";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { LoadAccountsController } from "../../presentation/controllers/account-controllers/load-accounts/load-accounts";
import { Controller } from "../../presentation/protocols/controller";

export const makeLoadAccountsController = (): Controller => {
  const loadAccountsRepository = new AccountMySqlRepository(prisma);
  const loadAccounts = new DbLoadAccounts(loadAccountsRepository);
  return new LoadAccountsController(loadAccounts);
};
