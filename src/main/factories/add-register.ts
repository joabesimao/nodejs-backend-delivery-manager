import { AddRegisterController } from "../../presentation/controllers/register-controllers/add-register/add-register";
import { DbAddRegister } from "../../data/usescases/register-usecases/add-register/db-add-register";
import { Controller } from "../../presentation/protocols/controller";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddRegisterController = (): Controller => {
  const registerRepository = new RegisterMySqlRepository(prisma);
  const addRegister = new DbAddRegister(registerRepository);
  const registerController = new AddRegisterController(addRegister);
  return registerController;
};
