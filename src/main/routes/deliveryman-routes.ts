import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddDeliverymanController } from "../factories/add-deliveryman";
import { makeLoadDeliverymanController } from "../factories/load-deliveryman";
import { makeUpdateDeliverymanController } from "../factories/update-deliveryman";
import { makeDeleteDeliverymanController } from "../factories/delete-deliveryman";
import { CATALOG_READ_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/deliveryman",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadDeliverymanController()),
  );
  router.post(
    "/deliveryman",
    auth(["admin"]),
    adaptRoute(makeAddDeliverymanController()),
  );
  router.put(
    "/deliveryman/:id",
    auth(["admin"]),
    adaptRoute(makeUpdateDeliverymanController()),
  );
  router.delete(
    "/deliveryman/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteDeliverymanController()),
  );
};
