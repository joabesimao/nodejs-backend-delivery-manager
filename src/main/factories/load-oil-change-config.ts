import { Controller } from "../../presentation/protocols/controller";
import { DbLoadOilChangeConfig } from "../../data/usescases/oil-change-usecases/load-oil-change-config/db-load-oil-change-config";
import { LoadOilChangeConfigController } from "../../presentation/controllers/oil-change-controllers/load-oil-change-config/load-oil-change-config";
import { makeOilChangeRepository } from "./repositories";

export const makeLoadOilChangeConfigController = (): Controller => {
  const oilChangeRepository = makeOilChangeRepository();
  const loadOilChangeConfig = new DbLoadOilChangeConfig(oilChangeRepository);
  return new LoadOilChangeConfigController(loadOilChangeConfig);
};
