import { DbUpdateAccount } from "../../data/usescases/account-usecases/update-account/db-update-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { UpdateAccountController } from "../../presentation/controllers/account-controllers/update-account/update-account";
import { Controller } from "../../presentation/protocols/controller";
import { makeUpdateAccountValidation } from "./update-account-validation";
import { makeAccountRepository } from "./repositories";

export const makeUpdateAccountController = (): Controller => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const accountRepository = makeAccountRepository();
  const updateAccount = new DbUpdateAccount(
    accountRepository,
    accountRepository,
    accountRepository,
    accountRepository,
    hasher,
    accountRepository,
  );

  return new UpdateAccountController(
    updateAccount,
    makeUpdateAccountValidation(),
  );
};
