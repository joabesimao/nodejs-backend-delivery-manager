import { DbLoadRegistersById } from "../../data/usescases/register-usecases/load-register/db-load-register-by-id";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { LoadOneRegistersController } from "../../presentation/controllers/register-controllers/load-register/load-one-register";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadRegisterByIdController = (): Controller => {
  const loadRegisterByIdRepository = new RegisterMySqlRepository(prisma);
  const dbRegisterById = new DbLoadRegistersById(loadRegisterByIdRepository);
  const controllerRegisterById = new LoadOneRegistersController(dbRegisterById);
  return controllerRegisterById;
};
