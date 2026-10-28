import { Express, Router } from "express";
import { notFound } from "../middlewares";
import mainRoutes from "../routes/routes";
import vehicleRoutes from "../routes/vehicle-routes";
import fuelRefillRoutes from "../routes/fuel-refill-routes";
import oilChangeRoutes from "../routes/oil-change-routes";
import notificationRoutes from "../routes/notification-routes";

const routeModules = [
  mainRoutes,
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
