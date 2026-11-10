import { AddRegisterController } from "../../presentation/controllers/register-controllers/add-register/add-register";
import { DbAddRegister } from "../../data/usescases/register-usecases/add-register/db-add-register";
import { Controller } from "../../presentation/protocols/controller";
import { makeAddRegisterValidation } from "./add-register-validation";
import { makeAddClientValidation } from "./add-client-validation";
import { makeAddAddressValidation } from "./add-address-validation";
import { makeRegisterRepository } from "./repositories";

export const makeAddRegisterController = (): Controller => {
  const registerRepository = makeRegisterRepository();
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
