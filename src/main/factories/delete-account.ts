import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-repository";
import { DbDeleteAccountById } from "../../data/usescases/delete-account/db-delete-account";
import { DeleteAccountController } from "../../presentation/controllers/delete-account/delete-account";

export const makeDeleteAccountController = (): Controller => {
  const deleteAccountRepository = new AccountMongoRepository();
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
