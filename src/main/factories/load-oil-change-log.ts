import { Controller } from "../../presentation/protocols/controller";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { DbLoadOilChangeLog } from "../../data/usescases/oil-change-usecases/load-oil-change-log/db-load-oil-change-log";
import { LoadOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/load-oil-change-log/load-oil-change-log";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeLoadOilChangeLogController = (): Controller => {
  const oilChangeRepository = new OilChangeMysqlRepository(prisma);
  const loadOilChangeLog = new DbLoadOilChangeLog(oilChangeRepository);
  return new LoadOilChangeLogController(loadOilChangeLog);
};
