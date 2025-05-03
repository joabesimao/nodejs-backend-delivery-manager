import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";
import { LoadRegistersController } from "../../presentation/controllers/load-register/load-register";
import { DbLoadRegisters } from "../../data/usescases/load-register/db-load-register";

export const makeLoadRegisterController = (): Controller => {
  const loadRegisterRepository = new RegisterMongoRepository();
  const listRegister = new DbLoadRegisters(loadRegisterRepository);
  const controller = new LoadRegistersController(listRegister);
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(controller, logErrorRepository);
};
