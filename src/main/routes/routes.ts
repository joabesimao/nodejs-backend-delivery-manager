import { Router } from "express";
import { makeRegisterController } from "../factories/register";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";
import { makeDeleteRegisterByIdController } from "../factories/delete-register-by-id";
import { makeUpdateRegisterController } from "../factories/update-register";
import { makeLoadRegisterByNameController } from "../factories/load-by-name-register";
import { makeSignupController } from "../factories/signup";
import { makeLoginController } from "../factories/login-factory";
import { makeAddOrderDeliveryController } from "../factories/add-order-delivery";

export default (router: Router): void => {
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/register/:id", adaptRoute(makeLoadRegisterByIdController()));
  router.get(
    "/register/name/:name",
    adaptRoute(makeLoadRegisterByNameController())
  );
  router.post("/register", adaptRoute(makeRegisterController()));
  router.post("/signup", adaptRoute(makeSignupController()));
  router.post("/login", adaptRoute(makeLoginController()));
  router.post("/orderDelivery", adaptRoute(makeAddOrderDeliveryController()));
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.delete(
    "/register/:id",
    adaptRoute(makeDeleteRegisterByIdController())
  );
};
