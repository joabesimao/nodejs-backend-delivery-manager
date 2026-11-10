import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeAddOrderDeliveryController } from "../factories/add-order-delivery";
import { makeLoadOrdersDeliveryController } from "../factories/load-order-delivery";
import { makeDeleteOrderDeliveryController } from "../factories/delete-order-delivery";
import { makeLoadOrderByIdController } from "../factories/load-order-delivery-by-id";
import { makeUpdateOrderDeliveryController } from "../factories/update-order-delivery";
import { makeLoadOrderDeliveryRankingController } from "../factories/load-order-delivery-ranking";
import { FIELD_WRITE_ROLES, OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get(
    "/orderDelivery",
    auth(),
    adaptRoute(makeLoadOrdersDeliveryController()),
  );
  router.get(
    "/orderDelivery/ranking/deliveryman",
    auth(),
    adaptRoute(makeLoadOrderDeliveryRankingController()),
  );
  router.get(
    "/orderDelivery/:id",
    auth(),
    adaptRoute(makeLoadOrderByIdController()),
  );
  router.post(
    "/orderDelivery",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.post(
    "/orderDelivery/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddOrderDeliveryController()),
  );
  router.put(
    "/orderDelivery/:id",
    auth(FIELD_WRITE_ROLES),
    adaptRoute(makeUpdateOrderDeliveryController()),
  );
  router.delete(
    "/orderDelivery/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteOrderDeliveryController()),
  );
};
