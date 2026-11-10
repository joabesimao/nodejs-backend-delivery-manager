import { Express, Router } from "express";
import { notFound } from "../middlewares";
import authRoutes from "../routes/auth-routes";
import accountRoutes from "../routes/account-routes";
import registerRoutes from "../routes/register-routes";
import clientRoutes from "../routes/client-routes";
import addressRoutes from "../routes/address-routes";
import orderDeliveryRoutes from "../routes/order-delivery-routes";
import dashboardRoutes from "../routes/dashboard-routes";
import searchRoutes from "../routes/search-routes";
import cityRoutes from "../routes/city-routes";
import neighborhoodRoutes from "../routes/neighborhood-routes";
import deliverymanRoutes from "../routes/deliveryman-routes";
import productRoutes from "../routes/product-routes";
import chatRoutes from "../routes/chat-routes";
import vehicleRoutes from "../routes/vehicle-routes";
import fuelRefillRoutes from "../routes/fuel-refill-routes";
import oilChangeRoutes from "../routes/oil-change-routes";
import notificationRoutes from "../routes/notification-routes";

const routeModules = [
  authRoutes,
  accountRoutes,
  registerRoutes,
  clientRoutes,
  addressRoutes,
  orderDeliveryRoutes,
  dashboardRoutes,
  searchRoutes,
  cityRoutes,
  neighborhoodRoutes,
  deliverymanRoutes,
  productRoutes,
  chatRoutes,
  vehicleRoutes,
  fuelRefillRoutes,
  oilChangeRoutes,
  notificationRoutes,
];

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  routeModules.forEach((registerRoutes) => registerRoutes(router));
  router.use(notFound);
};
