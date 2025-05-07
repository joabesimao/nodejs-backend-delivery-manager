import { AddRegisterController } from "../../presentation/controllers/add-register/add-register";
import { DbAddRegister } from "../../data/usescases/add-register/db-add-register";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddRegisterValidation } from "./add-register-validation";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";

export const makeAddRegisterController = (): Controller => {
  const registerRepository = new RegisterMySqlRepository();
  const addRegister = new DbAddRegister(registerRepository, registerRepository);
  /* const validation = makeAddRegisterValidation(); */
  const registerController = new AddRegisterController(addRegister);

  return registerController;
};
