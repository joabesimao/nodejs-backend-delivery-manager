import { DbDeleteRegisterById } from "../../data/usescases/delete-register/db-delete-register";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { DeleteRegisterController } from "../../presentation/controllers/delete-register/delete-register";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeDeleteRegisterByIdController = (): Controller => {
  const DeleteRegisterByIdRepository = new RegisterMySqlRepository();
  const deleteRegister = new DbDeleteRegisterById(DeleteRegisterByIdRepository);
  const controllerDeleteById = new DeleteRegisterController(deleteRegister);
  return controllerDeleteById;
};
