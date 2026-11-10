import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeGlobalSearchController } from "../factories/dashboard";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get("/search", auth(), adaptRoute(makeGlobalSearchController()));
};
