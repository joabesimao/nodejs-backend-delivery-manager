import {env} from "../../config/Env";
import { pool } from "../infra/db/mysql/helpers/";


pool
  .getConnection()
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(env.PORT, () =>
      console.log(`Server running at http://localhost:${3000}`)
    );
  })
  .catch((err) => {
    console.error("erro ao conectar", err);
  });
