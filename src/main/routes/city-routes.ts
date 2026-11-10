import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadCityController } from "../factories/load-city";
import { makeAddCityController } from "../factories/add-city";
import { makeUpdateCityController } from "../factories/update-city";
import { makeDeleteCityController } from "../factories/delete-city";
import { CATALOG_READ_ROLES, OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/city",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadCityController()),
  );
  router.post(
    "/city",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddCityController()),
  );
  router.put(
    "/city/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateCityController()),
  );
  router.delete(
    "/city/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteCityController()),
  );
};
