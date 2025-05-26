import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteAccountById } from "../../data/usescases/account-usescases/delete-account/db-delete-account";
import { DeleteAccountController } from "../../presentation/controllers/account-controllers/delete-account/delete-account";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteAccountController = (): Controller => {
  const deleteAccountRepository = new AccountMySqlRepository(prisma);
  const deleteAccountDelivery = new DbDeleteAccountById(
    deleteAccountRepository
  );
  const deleteaccountController = new DeleteAccountController(
    deleteAccountDelivery
  );
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(
    deleteaccountController,
    logErrorRepository
  );
};
