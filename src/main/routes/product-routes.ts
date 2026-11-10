import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddProductController } from "../factories/add-product";
import { makeLoadProductController } from "../factories/load-product";
import { makeLoadOneProductController } from "../factories/load-one-product";
import { makeUpdateProductController } from "../factories/update-product";
import { makeDeleteProductController } from "../factories/delete-product";
import { CATALOG_READ_ROLES, OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/product",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadProductController()),
  );
  router.get(
    "/product/:id",
    auth(CATALOG_READ_ROLES),
    adaptRoute(makeLoadOneProductController()),
  );
  router.post(
    "/product",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddProductController()),
  );
  router.put(
    "/product/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateProductController()),
  );
  router.delete(
    "/product/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteProductController()),
  );
};
