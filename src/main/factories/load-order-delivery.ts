import { DbLoadOrderDelivery } from "../../data/usescases/order-delivery/load-order-delivery/db-load-order-delivery";
import { LoadOrderDeliveryController } from "../../presentation/controllers/order-delivery-controllers/load-order-delivery/load-order-delivery";
import { Controller } from "../../presentation/protocols/controller";
import { makeOrderDeliveryRepository } from "./repositories";

export const makeLoadOrdersDeliveryController = (): Controller => {
  const loadOrderDeliveryRepository = makeOrderDeliveryRepository();
  const listOrdersOfDelivery = new DbLoadOrderDelivery(
    loadOrderDeliveryRepository
  );
  const controller = new LoadOrderDeliveryController(listOrdersOfDelivery);
  return controller;
};
