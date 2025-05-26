import { DbAddAccount } from "../../data/usescases/account-usescases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { SignupController } from "../../presentation/controllers/account-controllers/signup/signup";
import { Controller } from "../../presentation/protocols/controller";
import { makeDbAuthentication } from "./db-authentication-factory";
import { makeSignupValidation } from "./signup-validation";
import { AddAccountMySqlRepository } from "../../infra/db/mysql/signup-repository/signup-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeSignupController = (): Controller => {
  const salt = 12;
  const encrypt = new BcryptAdapter(salt);
  const accountRepository = new AddAccountMySqlRepository(prisma);
  const findAccountByEmailRepository = new AccountMySqlRepository(prisma);
  const addAccount = new DbAddAccount(
    encrypt,
    accountRepository,
    findAccountByEmailRepository
  );
  const authentication = makeDbAuthentication();
  const signupController = new SignupController(
    addAccount,
    makeSignupValidation(),
    authentication
  );

  return signupController;
};
