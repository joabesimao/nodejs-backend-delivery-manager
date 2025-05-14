import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LoginController } from "../../presentation/controllers/account-controllers/login/login";
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
