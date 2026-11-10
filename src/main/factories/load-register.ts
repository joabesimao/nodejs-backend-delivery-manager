import { Controller } from "../../presentation/protocols/controller";
import { LoadRegistersController } from "../../presentation/controllers/register-controllers/load-register/load-register";
import { DbLoadRegisters } from "../../data/usescases/register-usecases/load-register/db-load-register";
import { makeRegisterRepository } from "./repositories";

export const makeLoadRegisterController = (): Controller => {
  const loadRegisterRepository = makeRegisterRepository();
  const listRegister = new DbLoadRegisters(loadRegisterRepository);
  const controller = new LoadRegistersController(listRegister);
  return controller;
};
