import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadClientController } from "../factories/load-client-mysql";
import { makeLoadOneClientController } from "../factories/load-one-client-mysql";
import { makeDeleteClientController } from "../factories/delete-client-mysql";
import { makeUpdateClientController } from "../factories/update-client";
import { OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get("/client", auth(), adaptRoute(makeLoadClientController()));
  router.get("/client/:id", auth(), adaptRoute(makeLoadOneClientController()));
  router.put(
    "/client/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateClientController()),
  );
  router.delete(
    "/client/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteClientController()),
  );
};
