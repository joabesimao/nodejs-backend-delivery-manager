import { AddRegisterController } from "../../presentation/controllers/register-controllers/add-register/add-register";
import { DbAddRegister } from "../../data/usescases/register-usecases/add-register/db-add-register";
import { Controller } from "../../presentation/protocols/controller";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeAddRegisterValidation } from "./add-register-validation";
import { makeAddClientValidation } from "./add-client-validation";
import { makeAddAddressValidation } from "./add-address-validation";

export const makeAddRegisterController = (): Controller => {
  const registerRepository = new RegisterMySqlRepository(prisma);
  const addRegister = new DbAddRegister(registerRepository);
  const validation = makeAddRegisterValidation();
  const validationClient = makeAddClientValidation();
  const validationAddress = makeAddAddressValidation();
  const registerController = new AddRegisterController(
    addRegister,
    validation,
    validationClient,
    validationAddress
  );
  return registerController;
};
