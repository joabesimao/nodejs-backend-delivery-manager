import { Controller } from "../../presentation/protocols/controller";
import { LoadRegistersController } from "../../presentation/controllers/register-controllers/load-register/load-register";
import { DbLoadRegisters } from "../../data/usescases/register-usecases/load-register/db-load-register";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadRegisterController = (): Controller => {
  const loadRegisterRepository = new RegisterMySqlRepository(prisma);
  const listRegister = new DbLoadRegisters(loadRegisterRepository);
  const controller = new LoadRegistersController(listRegister);
  return controller;
};
