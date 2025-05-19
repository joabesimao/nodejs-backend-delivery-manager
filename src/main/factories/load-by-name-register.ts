import { DbLoadRegistersByName } from "../../data/usescases/register-usecases/load-register/db-load-register-by-name";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { LoadRegisterByNameController } from "../../presentation/controllers/register-controllers/load-register/load-register-by-name";
import { Controller } from "../../presentation/protocols/controller";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadRegisterByNameController = (): Controller => {
  const loadRegisterByNameRepository = new RegisterMySqlRepository(prisma);
  const dbRegisterByName = new DbLoadRegistersByName(
    loadRegisterByNameRepository
  );
  const controllerRegisterByName = new LoadRegisterByNameController(
    dbRegisterByName
  );
  return controllerRegisterByName;
};
