import { Router } from "express";
import { makeRegisterController } from "../factories/register";
import { adaptRoute } from "../../main/adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";
import { makeDeleteRegisterByIdController } from "../factories/delete-register-by-id";
import { makeUpdateRegisterController } from "../factories/update-register";

export default (router: Router): void => {
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/register/:id", adaptRoute(makeLoadRegisterByIdController()));
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.post("/register", adaptRoute(makeRegisterController()));
  router.delete(
    "/register/:id",
    adaptRoute(makeDeleteRegisterByIdController())
  );
};
