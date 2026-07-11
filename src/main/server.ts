import { createServer } from "http";
import { env } from "../../config/Env";
import { pool } from "../infra/db/mysql/helpers/";
import { setupRealtimeGateway } from "./realtime/realtime-gateway";

pool
  .getConnection()
  .then(async () => {
    const app = (await import("./config/app")).default;
    const httpServer = createServer(app);
    setupRealtimeGateway(httpServer);

    httpServer.listen(env.PORT, () =>
      console.log(`Server running at http://localhost:${env.PORT}`),
    );
  })
  .catch((err) => {
    console.error("erro ao conectar", err);
  });
