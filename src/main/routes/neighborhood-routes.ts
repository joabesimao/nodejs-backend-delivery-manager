import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadNeighborhoodController } from "../factories/load-neighborhood";
import { makeAddNeighborhoodController } from "../factories/add-neighborhood";
import { makeUpdateNeighborhoodController } from "../factories/update-neighborhood";
import { makeDeleteNeighborhoodController } from "../factories/delete-neighborhood";
import { CATALOG_READ_ROLES, OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/neighborhood",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadNeighborhoodController()),
  );
  router.post(
    "/neighborhood",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddNeighborhoodController()),
  );
  router.put(
    "/neighborhood/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateNeighborhoodController()),
  );
  router.delete(
    "/neighborhood/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteNeighborhoodController()),
  );
};
