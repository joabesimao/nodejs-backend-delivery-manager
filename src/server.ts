import { createServer } from "http";
import type { Express } from "express";
import expressApp from "./main/config/app";
import { setupRealtimeGateway } from "./main/realtime/realtime-gateway";

const app: Express = expressApp;
const httpServer = createServer(app);
setupRealtimeGateway(httpServer);

export default httpServer;
