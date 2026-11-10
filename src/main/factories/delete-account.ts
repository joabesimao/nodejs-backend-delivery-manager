import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteAccountById } from "../../data/usescases/account-usecases/delete-account/db-delete-account";
import { DeleteAccountController } from "../../presentation/controllers/account-controllers/delete-account/delete-account";
import { makeAccountRepository } from "./repositories";

export const makeDeleteAccountController = (): Controller => {
  const deleteAccountRepository = makeAccountRepository();
  const deleteAccountDelivery = new DbDeleteAccountById(
    deleteAccountRepository,
    deleteAccountRepository,
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
