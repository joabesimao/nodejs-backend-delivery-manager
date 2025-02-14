import { AddRegisterController } from "../../presentation/controllers/add-register/addRegister";
import { DbAddRegister } from "../../data/usescases/addRegister/db-addRegister";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";

export const makeRegisterController = (): Controller => {
  const registerRepository = new RegisterMongoRepository();
  const addRegister = new DbAddRegister(registerRepository);
  const registerController = new AddRegisterController(addRegister);
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(registerController, logErrorRepository);
};
