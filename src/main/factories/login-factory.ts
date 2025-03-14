import env from "../../env";
import { DbAuthentication } from "../../data/usescases/authentication/db-authentication";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-repository";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LoginController } from "../../presentation/controllers/login/login";
import { LogControllerDecorator } from "../decorators/log";
import { makeLoginValidation } from "./login-validation";
import { makeDbAuthentication } from "./db-authentication-factory";

export const makeLoginController = (): LogControllerDecorator => {
  const authentication = makeDbAuthentication();
  const validation = makeLoginValidation();
  const loginController = new LoginController(authentication, validation);
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
