import express from "express";
import swaggerUi from "swagger-ui-express";
import setupMiddleware from "./middlewares";
import setupRoutes from "./routes";
import { swaggerSpec } from "./swagger";

const app = express();
setupMiddleware(app);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
setupRoutes(app);

export default app;
