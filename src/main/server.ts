/* import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import env from "../env"; */
/* 
MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    );
  })
  .catch(console.error); */

import { pool } from "../infra/db/mysql/helpers/";
import env from "../env";

pool
  .getConnection()
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(env.serverPort, () =>
      console.log(`Server running at http://localhost:${env.serverPort}`)
    );
  })
  .catch((err) => {
    console.error("erro ao conectar", err);
  });
