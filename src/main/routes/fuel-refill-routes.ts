import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/auth-middleware-factory";
import { makeAddFuelRefillController } from "../factories/add-fuel-refill";
import { makeLoadFuelRefillController } from "../factories/load-fuel-refill";

const auth = (roles?: string[]) => adaptMiddleware(makeAuthMiddleware(roles));

export default (router: Router): void => {
  router.get(
    "/fuel-refill",
    auth(["admin", "gerente_estoque", "entregador"]),
    adaptRoute(makeLoadFuelRefillController())
  );
  router.post(
    "/fuel-refill",
    auth(["admin", "gerente_estoque", "entregador"]),
    adaptRoute(makeAddFuelRefillController())
  );
};
