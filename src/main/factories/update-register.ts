import { DbUpdateRegister } from "../../data/usescases/register-usecases/update-register/db-update-register";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { RegisterMySqlRepository } from "../../infra/db/mysql/register-repository/register-mysql-repository";
import { UpdateRegisterController } from "../../presentation/controllers/register-controllers/update-register/update-register";
import { Controller } from "../../presentation/protocols/controller";

export const makeUpdateRegisterController = (): Controller => {
  const updateRepository = new RegisterMongoRepository();
  const updateRegister = new DbUpdateRegister(updateRepository);
  const registerController = new UpdateRegisterController(updateRegister);
  return registerController;
};
