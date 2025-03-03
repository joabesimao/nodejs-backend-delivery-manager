import { Router } from "express";
import { makeRegisterController } from "../factories/register";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";
import { makeDeleteRegisterByIdController } from "../factories/delete-register-by-id";
import { makeUpdateRegisterController } from "../factories/update-register";
import { makeLoadRegisterByNameController } from "../factories/load-by-name-register";
import { makeSignupController } from "../factories/signup";

export default (router: Router): void => {
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/register/:id", adaptRoute(makeLoadRegisterByIdController()));
  router.get(
    "/register/name/:name",
    adaptRoute(makeLoadRegisterByNameController())
  );
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.post("/register", adaptRoute(makeRegisterController()));
  router.delete(
    "/register/:id",
    adaptRoute(makeDeleteRegisterByIdController())
  );
  router.post("/signup", adaptRoute(makeSignupController()));
};
