import { Controller } from "../../presentation/protocols/controller";
import { OilChangeMysqlRepository } from "../../infra/db/mysql/oil-change-repository/oil-change-repository";
import { DbUpdateOilChangeLog } from "../../data/usescases/oil-change-usecases/update-oil-change-log/db-update-oil-change-log";
import { UpdateOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/update-oil-change-log/update-oil-change-log";
import { prisma } from "../../infra/db/mysql/helpers/index";
import { makeUpdateOilChangeLogValidation } from "./update-oil-change-log-validation";

export const makeUpdateOilChangeLogController = (): Controller => {
  const oilChangeRepository = new OilChangeMysqlRepository(prisma);
  const updateOilChangeLog = new DbUpdateOilChangeLog(oilChangeRepository, oilChangeRepository, oilChangeRepository);
  const validation = makeUpdateOilChangeLogValidation();
  return new UpdateOilChangeLogController(updateOilChangeLog, validation);
};
