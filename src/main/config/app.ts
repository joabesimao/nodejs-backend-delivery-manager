import express from "express";
import swaggerUi from "swagger-ui-express";
import setupMiddleware from "./middlewares";
import setupRoutes from "./routes";
import { swaggerSpec } from "./swagger";
import { errorHandler } from "../middlewares";
import { env } from "../../../config/Env";

const app = express();
if (env.VERCEL) app.set("trust proxy", 1);
setupMiddleware(app);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
setupRoutes(app);
app.use(errorHandler);

export default app;
