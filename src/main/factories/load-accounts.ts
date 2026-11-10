import { DbLoadAccounts } from "../../data/usescases/account-usecases/load-accounts/db-load-accounts";
import { LoadAccountsController } from "../../presentation/controllers/account-controllers/load-accounts/load-accounts";
import { Controller } from "../../presentation/protocols/controller";
import { makeAccountRepository } from "./repositories";

export const makeLoadAccountsController = (): Controller => {
  const loadAccountsRepository = makeAccountRepository();
  const loadAccounts = new DbLoadAccounts(loadAccountsRepository);
  return new LoadAccountsController(loadAccounts);
};
