import { Controller } from "../../presentation/protocols/controller";
import { DbDeleteOilChangeLog } from "../../data/usescases/oil-change-usecases/delete-oil-change-log/db-delete-oil-change-log";
import { DeleteOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/delete-oil-change-log/delete-oil-change-log";
import { makeOilChangeRepository } from "./repositories";

export const makeDeleteOilChangeLogController = (): Controller => {
  const oilChangeRepository = makeOilChangeRepository();
  const deleteOilChangeLog = new DbDeleteOilChangeLog(oilChangeRepository, oilChangeRepository);
  return new DeleteOilChangeLogController(deleteOilChangeLog);
};
