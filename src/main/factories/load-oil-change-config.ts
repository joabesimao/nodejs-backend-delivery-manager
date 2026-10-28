import { Controller } from "../../presentation/protocols/controller";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { DbLoadOilChangeConfig } from "../../data/usescases/oil-change-usecases/load-oil-change-config/db-load-oil-change-config";
import { LoadOilChangeConfigController } from "../../presentation/controllers/oil-change-controllers/load-oil-change-config/load-oil-change-config";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadOilChangeConfigController = (): Controller => {
  const oilChangeRepository = new OilChangeMysqlRepository(prisma);
  const loadOilChangeConfig = new DbLoadOilChangeConfig(oilChangeRepository);
  return new LoadOilChangeConfigController(loadOilChangeConfig);
};
