import { Express, Router } from "express";
import { notFound } from "../middlewares";
import mainRoutes from "../routes/routes";
import vehicleRoutes from "../routes/vehicle-routes";
import fuelRefillRoutes from "../routes/fuel-refill-routes";
import oilChangeRoutes from "../routes/oil-change-routes";
import notificationRoutes from "../routes/notification-routes";

// Imports estáticos: funcionam tanto em TS (dev) quanto no JS compilado (dist)
// e garantem que todas as rotas existam antes do servidor aceitar requisições.
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
