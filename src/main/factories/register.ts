import { AddRegisterController } from "../../presentation/controllers/addRegister/addRegister";
import { DbAddRegister } from "../../data/usescases/addRegister/db-addRegister";
import { RegisterMongoRepository } from "../../infra/db/mongodb/register-repository/register";

export const makeRegisterController = (): AddRegisterController => {
  const registerRepository = new RegisterMongoRepository();

  const addRegister = new DbAddRegister(registerRepository);
  const registerController = new AddRegisterController(addRegister);
  return registerController;
};
