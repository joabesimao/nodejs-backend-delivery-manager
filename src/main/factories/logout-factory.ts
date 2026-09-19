import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { prisma } from "../../infra/db/mysql/helpers";
import { LogoutController } from "../../presentation/controllers/account-controllers/logout/logout";
import { Controller } from "../../presentation/protocols/controller";

export const makeLogoutController = (): Controller => {
  const accountRepository = new AccountMySqlRepository(prisma);
  return new LogoutController(accountRepository);
};
