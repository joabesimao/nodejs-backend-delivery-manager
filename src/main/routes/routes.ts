import { Router } from "express";
import { makeAddRegisterController } from "../factories/add-register";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";
import { makeDeleteRegisterByIdController } from "../factories/delete-register-by-id";
import { makeUpdateRegisterController } from "../factories/update-register";
import { makeLoadRegisterByNameController } from "../factories/load-by-name-register";
import { makeSignupController } from "../factories/signup";
import { makeLoginController } from "../factories/login-factory";
import { makeAddOrderDeliveryController } from "../factories/add-order-delivery";
import { adaptMiddleware } from "../adapters/express-middleware-adapter";
import { makeAuthMiddleware } from "../factories/auth-middleware-factory";
import { makeLoadOrdersDeliveryController } from "../factories/load-order-delivery";
import { makeDeleteOrderDeliveryController } from "../factories/delete-order-delivery";
import { makeLoadOrderByIdController } from "../factories/load-order-delivery-by-id";

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
  router.get("/register", adminAuth, adaptRoute(makeLoadRegisterController()));
  router.get("/orderDelivery", adaptRoute(makeLoadOrdersDeliveryController()));
  router.get(
    "/register/:id",
    adminAuth,
    adaptRoute(makeLoadRegisterByIdController())
  );
  router.get(
    "/register/name/:name",
    adminAuth,
    adaptRoute(makeLoadRegisterByNameController())
  );
  router.get(
    "/orderDelivery/:id",

    adaptRoute(makeLoadOrderByIdController())
  );
  router.post("/register", adminAuth, adaptRoute(makeAddRegisterController()));
  router.post("/signup", adaptRoute(makeSignupController()));
  router.post("/login", adaptRoute(makeLoginController()));
  router.post(
    "/orderDelivery",
    adminAuth,
    adaptRoute(makeAddOrderDeliveryController())
  );
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.delete(
    "/register/:id",

    adaptRoute(makeDeleteRegisterByIdController())
  );
  router.delete(
    "/orderDelivery/:id",

    adaptRoute(makeDeleteOrderDeliveryController())
  );
};
