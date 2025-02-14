import { DbDeleteRegisterById } from "../../data/usescases/deleteRegister/db-delete-register";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log-mongo-repository";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { DeleteRegisterController } from "../../presentation/controllers/delete-register/delete-register";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorators/log";

export const makeDeleteRegisterByIdController = (): Controller => {
  const DeleteRegisterByIdRepository = new RegisterMongoRepository();
  const deleteRegister = new DbDeleteRegisterById(DeleteRegisterByIdRepository);
  const controllerDeleteById = new DeleteRegisterController(deleteRegister);
  const logError = new LogMongoRepository();
  return new LogControllerDecorator(controllerDeleteById, logError);
};
