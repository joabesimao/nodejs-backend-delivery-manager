import { DbDeleteRegisterById } from "../../data/usescases/register-usecases/delete-register/db-delete-register";
import { DeleteRegisterController } from "../../presentation/controllers/register-controllers/delete-register/delete-register";
import { Controller } from "../../presentation/protocols/controller";
import { makeRegisterRepository } from "./repositories";

export const makeDeleteRegisterByIdController = (): Controller => {
  const DeleteRegisterByIdRepository = makeRegisterRepository();
  const deleteRegister = new DbDeleteRegisterById(DeleteRegisterByIdRepository);
  const controllerDeleteById = new DeleteRegisterController(deleteRegister);
  return controllerDeleteById;
};
