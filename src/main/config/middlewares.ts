import { Express } from "express";
import helmet from "helmet";
import { bodyParser, contentType, cors } from "../middlewares/";

export default (app: Express): void => {
  app.use(helmet());
  app.use(cors);
  app.use(bodyParser);
  app.use(contentType);
};
