import { Controller } from "../../presentation/protocols/controller";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { DbDeleteOilChangeLog } from "../../data/usescases/oil-change-usecases/delete-oil-change-log/db-delete-oil-change-log";
import { DeleteOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/delete-oil-change-log/delete-oil-change-log";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDeleteOilChangeLogController = (): Controller => {
  const oilChangeRepository = new OilChangeMysqlRepository(prisma);
  const deleteOilChangeLog = new DbDeleteOilChangeLog(oilChangeRepository, oilChangeRepository);
  return new DeleteOilChangeLogController(deleteOilChangeLog);
};
