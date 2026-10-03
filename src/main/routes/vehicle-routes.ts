import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/auth-middleware-factory";
import { makeAddVehicleController } from "../factories/add-vehicle";
import { makeLoadVehicleController } from "../factories/load-vehicle";
import { makeUpdateVehicleController } from "../factories/update-vehicle";
import { makeDeleteVehicleController } from "../factories/delete-vehicle";
import { FLEET_READ_ROLES, OPERATOR_WRITE_ROLES } from "../config/roles";

const auth = (roles?: string[]) => adaptMiddleware(makeAuthMiddleware(roles));

export default (router: Router): void => {
  router.get(
    "/vehicle",
    auth(FLEET_READ_ROLES),
    adaptRoute(makeLoadVehicleController())
  );
  router.post(
    "/vehicle",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddVehicleController())
  );
  router.put(
    "/vehicle/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateVehicleController())
  );
  router.delete(
    "/vehicle/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeDeleteVehicleController())
  );
};
