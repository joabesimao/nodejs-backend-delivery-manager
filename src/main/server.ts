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

pool
  .getConnection()
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(3000, () =>
      console.log(`Server running at http://localhost:3000`)
    );
  })
  .catch((err) => {
    console.error("erro ao conectar", err);
  });
