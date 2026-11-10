import { Controller } from "../../presentation/protocols/controller";
import { DbUpdateOilChangeConfig } from "../../data/usescases/oil-change-usecases/update-oil-change-config/db-update-oil-change-config";
import { UpdateOilChangeConfigController } from "../../presentation/controllers/oil-change-controllers/update-oil-change-config/update-oil-change-config";
import { makeUpdateOilChangeConfigValidation } from "./update-oil-change-config-validation";
import { makeOilChangeRepository } from "./repositories";

export const makeUpdateOilChangeConfigController = (): Controller => {
  const oilChangeRepository = makeOilChangeRepository();
  const updateOilChangeConfig = new DbUpdateOilChangeConfig(oilChangeRepository);
  const validation = makeUpdateOilChangeConfigValidation();
  return new UpdateOilChangeConfigController(updateOilChangeConfig, validation);
};
