import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadAddressController } from "../factories/load-address";
import { makeUpdateAddressController } from "../factories/update-address";
import { makeDeleteAddressController } from "../factories/delete-address";
import { OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get("/address", auth(), adaptRoute(makeLoadAddressController()));
  router.put(
    "/address/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateAddressController()),
  );
  router.delete(
    "/address/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteAddressController()),
  );
};
