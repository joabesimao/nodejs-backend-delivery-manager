import { DbAddAccount } from "../../data/usescases/account-usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { AddAccountMySqlRepository } from "../../infra/db/mysql/signup-repository/signup-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { AddStaffAccountController } from "../../presentation/controllers/account-controllers/add-staff-account/add-staff-account";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddStaffAccountValidation } from "./add-staff-account-validation";

export const makeAddStaffAccountController = (): Controller => {
  const salt = 12;
  const encrypt = new BcryptAdapter(salt);
  const accountRepository = new AddAccountMySqlRepository(prisma);
  const findAccountByEmailRepository = new AccountMySqlRepository(prisma);
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
