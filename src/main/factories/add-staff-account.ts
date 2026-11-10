import { DbAddAccount } from "../../data/usescases/account-usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AddStaffAccountController } from "../../presentation/controllers/account-controllers/add-staff-account/add-staff-account";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddStaffAccountValidation } from "./add-staff-account-validation";
import { makeAccountRepository, makeAddAccountRepository } from "./repositories";

export const makeAddStaffAccountController = (): Controller => {
  const salt = 12;
  const encrypt = new BcryptAdapter(salt);
  const accountRepository = makeAddAccountRepository();
  const findAccountByEmailRepository = makeAccountRepository();
  const addAccount = new DbAddAccount(
    encrypt,
    accountRepository,
    findAccountByEmailRepository,
  );

  return new AddStaffAccountController(
    addAccount,
    makeAddStaffAccountValidation(),
  );
};
