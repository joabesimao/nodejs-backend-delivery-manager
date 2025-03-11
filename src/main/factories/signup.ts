import { DbAddAccount } from "../../data/usescases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { AddAccountMongoRepository } from "../../infra/db/mongodb/signup-repository/signup-repository";
import { SignupController } from "../../presentation/controllers/signup/signup";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";
import { makeSignupValidation } from "./signup-validation";

export const makeSignupController = (): Controller => {
  const salt = 12;
  const encrypt = new BcryptAdapter(salt);
  const accountRepository = new AddAccountMongoRepository();
  const addAccount = new DbAddAccount(encrypt, accountRepository);
  const signupController = new SignupController(
    addAccount,
    makeSignupValidation()
  );
  const logError = new LogMongoRepository();
  return new LogControllerDecorator(signupController, logError);
};
