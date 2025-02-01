import { AddRegisterController } from "../../presentation/controllers/addRegister/addRegister";
import { DbAddRegister } from "../../data/usescases/addRegister/db-addRegister";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols/controller";

export const makeRegisterController = (): Controller => {
  const registerRepository = new RegisterMongoRepository();

  const addRegister = new DbAddRegister(registerRepository);
  const registerController = new AddRegisterController(addRegister);

  return new LogControllerDecorator(registerController);
};
