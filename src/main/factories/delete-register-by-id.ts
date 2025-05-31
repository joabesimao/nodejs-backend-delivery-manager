import { DbDeleteRegisterById } from "../../data/usescases/register-usecases/delete-register/db-delete-register";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { DeleteRegisterController } from "../../presentation/controllers/register-controllers/delete-register/delete-register";
import { Controller } from "../../presentation/protocols/controller";

export const makeDeleteRegisterByIdController = (): Controller => {
  const DeleteRegisterByIdRepository = new RegisterMongoRepository();
  const deleteRegister = new DbDeleteRegisterById(DeleteRegisterByIdRepository);
  const controllerDeleteById = new DeleteRegisterController(deleteRegister);
  return controllerDeleteById;
};
