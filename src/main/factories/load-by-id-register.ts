import { DbLoadRegistersById } from "../../data/usescases/loadRegister/db-load-register-by-id";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { LoadOneRegistersController } from "../../presentation/controllers/load-register/loadOne-register";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeLoadRegisterByIdController = (): Controller => {
  const loadRegisterByIdRepository = new RegisterMongoRepository();
  const dbRegisterById = new DbLoadRegistersById(loadRegisterByIdRepository);
  const controllerRegisterById = new LoadOneRegistersController(dbRegisterById);
  const logError = new LogMongoRepository();
  return new LogControllerDecorator(controllerRegisterById, logError);
};
