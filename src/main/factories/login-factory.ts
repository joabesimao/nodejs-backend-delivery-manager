import { LoginController } from "../../presentation/controllers/account-controllers/login/login";
import { makeLoginValidation } from "./login-validation";
import { makeDbAuthentication } from "./db-authentication-factory";
import { Controller } from "../../presentation/protocols/controller";

export const makeLoginController = (): Controller => {
  const authentication = makeDbAuthentication();
  const validation = makeLoginValidation();
  const loginController = new LoginController(authentication, validation);
  return loginController;
};
