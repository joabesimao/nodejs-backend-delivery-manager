import { Controller } from "../../presentation/protocols/controller";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { DbUpdateOilChangeConfig } from "../../data/usescases/oil-change-usecases/update-oil-change-config/db-update-oil-change-config";
import { UpdateOilChangeConfigController } from "../../presentation/controllers/oil-change-controllers/update-oil-change-config/update-oil-change-config";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeUpdateOilChangeConfigValidation } from "./update-oil-change-config-validation";

export const makeUpdateOilChangeConfigController = (): Controller => {
  const oilChangeRepository = new OilChangeMysqlRepository(prisma);
  const updateOilChangeConfig = new DbUpdateOilChangeConfig(oilChangeRepository);
  const validation = makeUpdateOilChangeConfigValidation();
  return new UpdateOilChangeConfigController(updateOilChangeConfig, validation);
};
