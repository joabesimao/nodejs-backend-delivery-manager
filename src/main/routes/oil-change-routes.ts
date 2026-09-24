import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/auth-middleware-factory";
import { makeAddOilChangeLogController } from "../factories/add-oil-change-log";
import { makeLoadOilChangeLogController } from "../factories/load-oil-change-log";
import { makeLoadOilChangeConfigController } from "../factories/load-oil-change-config";
import { makeUpdateOilChangeConfigController } from "../factories/update-oil-change-config";

const auth = (roles?: string[]) => adaptMiddleware(makeAuthMiddleware(roles));

export default (router: Router): void => {
  router.get(
    "/oil-change-config",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeLoadOilChangeConfigController())
  );
  router.put(
    "/oil-change-config",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateOilChangeConfigController())
  );
  router.get(
    "/oil-change-log",
    auth(["admin", "gerente_estoque", "entregador"]),
    adaptRoute(makeLoadOilChangeLogController())
  );
  router.post(
    "/oil-change-log",
    auth(["admin", "gerente_estoque", "entregador"]),
    adaptRoute(makeAddOilChangeLogController())
  );
};
