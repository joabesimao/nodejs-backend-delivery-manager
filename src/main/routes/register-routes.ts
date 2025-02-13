import { Router } from "express";
import { makeRegisterController } from "../factories/register";
import { adaptRoute } from "../../main/adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";

export default (router: Router): void => {
  router.post("/register", adaptRoute(makeRegisterController()));
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/register/:id", adaptRoute(makeLoadRegisterByIdController()));
};
