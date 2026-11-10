import { DbLoadRegistersByName } from "../../data/usescases/register-usecases/load-register/db-load-register-by-name";
import { LoadRegisterByNameController } from "../../presentation/controllers/register-controllers/load-register/load-register-by-name";
import { Controller } from "../../presentation/protocols/controller";
import { makeRegisterRepository } from "./repositories";

export const makeLoadRegisterByNameController = (): Controller => {
  const loadRegisterByNameRepository = makeRegisterRepository();
  const dbRegisterByName = new DbLoadRegistersByName(
    loadRegisterByNameRepository
  );
  const controllerRegisterByName = new LoadRegisterByNameController(
    dbRegisterByName
  );
  return controllerRegisterByName;
};
