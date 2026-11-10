import { DbAddAccount } from "../../data/usescases/account-usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { SignupController } from "../../presentation/controllers/account-controllers/signup/signup";
import { Controller } from "../../presentation/protocols/controller";
import { makeDbAuthentication } from "./db-authentication-factory";
import { makeSignupValidation } from "./signup-validation";
import { makeAccountRepository, makeAddAccountRepository } from "./repositories";

export const makeSignupController = (): Controller => {
  const salt = 12;
  const encrypt = new BcryptAdapter(salt);
  const accountRepository = makeAddAccountRepository();
  const findAccountByEmailRepository = makeAccountRepository();
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
