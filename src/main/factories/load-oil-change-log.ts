import { Controller } from "../../presentation/protocols/controller";
import { DbLoadOilChangeLog } from "../../data/usescases/oil-change-usecases/load-oil-change-log/db-load-oil-change-log";
import { LoadOilChangeLogController } from "../../presentation/controllers/oil-change-controllers/load-oil-change-log/load-oil-change-log";
import { makeOilChangeRepository } from "./repositories";

export const makeLoadOilChangeLogController = (): Controller => {
  const oilChangeRepository = makeOilChangeRepository();
  const loadOilChangeLog = new DbLoadOilChangeLog(oilChangeRepository);
  return new LoadOilChangeLogController(loadOilChangeLog);
};
