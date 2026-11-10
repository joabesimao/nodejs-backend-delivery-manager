import { Controller } from "../../presentation/protocols/controller";
import { DbUpdateOilChangeLog } from "../../data/usescases/oil-change-usecases/update-oil-change-log/db-update-oil-change-log";
import { UpdateOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/update-oil-change-log/update-oil-change-log";
import { makeUpdateOilChangeLogValidation } from "./update-oil-change-log-validation";
import { makeOilChangeRepository } from "./repositories";

export const makeUpdateOilChangeLogController = (): Controller => {
  const oilChangeRepository = makeOilChangeRepository();
  const updateOilChangeLog = new DbUpdateOilChangeLog(oilChangeRepository, oilChangeRepository, oilChangeRepository);
  const validation = makeUpdateOilChangeLogValidation();
  return new UpdateOilChangeLogController(updateOilChangeLog, validation);
};
