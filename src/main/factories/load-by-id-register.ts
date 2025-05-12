import { DbLoadRegistersById } from "../../data/usescases/register-usecases/load-register/db-load-register-by-id";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { LoadOneRegistersController } from "../../presentation/controllers/register-controllers/load-register/load-one-register";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeLoadRegisterByIdController = (): Controller => {
  const loadRegisterByIdRepository = new RegisterMongoRepository();
  const dbRegisterById = new DbLoadRegistersById(loadRegisterByIdRepository);
  const controllerRegisterById = new LoadOneRegistersController(dbRegisterById);
  const logError = new LogMongoRepository();
  return new LogControllerDecorator(controllerRegisterById, logError);
};
