import { Express, Router } from "express";
import fg from "fast-glob";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  fg.sync("**/src/main/routes/**routes.ts").forEach((file) => {
    import(`../../../${file}`)
      .then((routeModule) => routeModule.default(router))
      .catch((error) => {
        console.error(`[routes] Falha ao carregar rotas de ${file}:`, error);
      });
  });
};
