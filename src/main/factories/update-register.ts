import { DbUpdateRegister } from "../../data/usescases/register-usecases/update-register/db-update-register";
import { UpdateRegisterController } from "../../presentation/controllers/register-controllers/update-register/update-register";
import { Controller } from "../../presentation/protocols/controller";
import { makeRegisterRepository } from "./repositories";

export const makeUpdateRegisterController = (): Controller => {
  const updateRepository = makeRegisterRepository();
  const updateRegister = new DbUpdateRegister(updateRepository);
  const registerController = new UpdateRegisterController(updateRegister);
  return registerController;
};
