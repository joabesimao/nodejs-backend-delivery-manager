import { DbLoadRegistersById } from "../../data/usescases/register-usecases/load-register/db-load-register-by-id";
import { LoadOneRegistersController } from "../../presentation/controllers/register-controllers/load-register/load-one-register";
import { Controller } from "../../presentation/protocols/controller";
import { makeRegisterRepository } from "./repositories";

export const makeLoadRegisterByIdController = (): Controller => {
  const loadRegisterByIdRepository = makeRegisterRepository();
  const dbRegisterById = new DbLoadRegistersById(loadRegisterByIdRepository);
  const controllerRegisterById = new LoadOneRegistersController(dbRegisterById);
  return controllerRegisterById;
};
