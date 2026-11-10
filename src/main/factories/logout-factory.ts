import { LogoutController } from "../../presentation/controllers/account-controllers/logout/logout";
import { Controller } from "../../presentation/protocols/controller";
import { makeAccountRepository } from "./repositories";

export const makeLogoutController = (): Controller => {
  const accountRepository = makeAccountRepository();
  return new LogoutController(accountRepository);
};
