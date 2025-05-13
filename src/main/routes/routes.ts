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
import { makeDeleteAccountController } from "../factories/delete-account";
import { makeLoadClientController } from "../factories/load-client-mysql";
import { makeLoadOneClientController } from "../factories/load-one-client-mysql";
import { makeLoadAddressController } from "../factories/load-address";
import { makeUpdateOrderDeliveryController } from "../factories/update-order-delivery";
import { makeUpdateAddressController } from "../factories/update-address";
import { makeDeleteAddressController } from "../factories/delete-address";
import { makeDeleteClientController } from "../factories/delete-client-mysql";

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware("admin"));
  router.get("/register", adaptRoute(makeLoadRegisterController()));
  router.get("/client", adaptRoute(makeLoadClientController()));
  router.get("/orderDelivery", adaptRoute(makeLoadOrdersDeliveryController()));
  router.get("/address", adaptRoute(makeLoadAddressController()));
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
  router.get("/client/:id", adaptRoute(makeLoadOneClientController()));
  router.post("/register", adaptRoute(makeAddRegisterController()));
  router.post("/signup", adaptRoute(makeSignupController()));
  router.post("/login", adaptRoute(makeLoginController()));
  router.post(
    "/orderDelivery",

    adaptRoute(makeAddOrderDeliveryController())
  );
  router.post(
    "/orderDelivery/:id",

    adaptRoute(makeAddOrderDeliveryController())
  );
  router.put("/register/:id", adaptRoute(makeUpdateRegisterController()));
  router.put("/address/:id", adaptRoute(makeUpdateAddressController()));
  router.put(
    "/orderDelivery/:id",
    adaptRoute(makeUpdateOrderDeliveryController())
  );
  router.delete(
    "/register/:id",

    adaptRoute(makeDeleteRegisterByIdController())
  );
  router.delete(
    "/orderDelivery/:id",

    adaptRoute(makeDeleteOrderDeliveryController())
  );

  router.delete(
    "/account/:id",

    adaptRoute(makeDeleteAccountController())
  );

  router.delete(
    "/address/:id",

    adaptRoute(makeDeleteAddressController())
  );

  router.delete(
    "/client/:id",

    adaptRoute(makeDeleteClientController())
  );
};
