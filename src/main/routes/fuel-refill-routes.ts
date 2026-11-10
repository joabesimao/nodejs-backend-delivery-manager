import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { auth } from "../middlewares/auth";
import { makeAddFuelRefillController } from "../factories/add-fuel-refill";
import { makeLoadFuelRefillController } from "../factories/load-fuel-refill";
import { makeUpdateFuelRefillController } from "../factories/update-fuel-refill";
import { makeDeleteFuelRefillController } from "../factories/delete-fuel-refill";
import { FIELD_WRITE_ROLES, FLEET_READ_ROLES } from "../config/roles";

export default (router: Router): void => {
  router.get(
    "/fuel-refill",
    auth(FLEET_READ_ROLES),
    adaptRoute(makeLoadFuelRefillController())
  );
  router.post(
    "/fuel-refill",
    auth(FIELD_WRITE_ROLES),
    adaptRoute(makeAddFuelRefillController())
  );
  router.put(
    "/fuel-refill/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeUpdateFuelRefillController())
  );
  router.delete(
    "/fuel-refill/:id",
    auth(["admin", "gerente_estoque"]),
    adaptRoute(makeDeleteFuelRefillController())
  );
};
