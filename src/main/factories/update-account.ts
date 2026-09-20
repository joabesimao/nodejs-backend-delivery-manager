import { DbUpdateAccount } from "../../data/usescases/account-usecases/update-account/db-update-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { UpdateAccountController } from "../../presentation/controllers/account-controllers/update-account/update-account";
import { Controller } from "../../presentation/protocols/controller";
import { makeUpdateAccountValidation } from "./update-account-validation";

export const makeUpdateAccountController = (): Controller => {
  const salt = 12;
  const hasher = new BcryptAdapter(salt);
  const accountRepository = new AccountMySqlRepository(prisma);
  const updateAccount = new DbUpdateAccount(
    accountRepository,
    accountRepository,
    accountRepository,
    accountRepository,
    hasher,
  );

  return new UpdateAccountController(
    updateAccount,
    makeUpdateAccountValidation(),
  );
};
