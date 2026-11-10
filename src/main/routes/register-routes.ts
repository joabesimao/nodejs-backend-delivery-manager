import { Router } from "express";
import { makeAddRegisterController } from "../factories/add-register";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeLoadRegisterController } from "../factories/load-register";
import { makeLoadRegisterByIdController } from "../factories/load-by-id-register";
import { makeDeleteRegisterByIdController } from "../factories/delete-register-by-id";
import { makeUpdateRegisterController } from "../factories/update-register";
import { makeLoadRegisterByNameController } from "../factories/load-by-name-register";
import { OPERATOR_WRITE_ROLES } from "../config/roles";
import { auth } from "../middlewares/auth";

export default (router: Router): void => {
  router.get("/register", auth(), adaptRoute(makeLoadRegisterController()));
  router.get(
    "/register/:id",
    auth(),
    adaptRoute(makeLoadRegisterByIdController()),
  );
  router.get(
    "/register/name/:name",
    auth(),
    adaptRoute(makeLoadRegisterByNameController()),
  );
  router.post(
    "/register",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeAddRegisterController()),
  );
  router.put(
    "/register/:id",
    auth(OPERATOR_WRITE_ROLES),
    adaptRoute(makeUpdateRegisterController()),
  );
  router.delete(
    "/register/:id",
    auth(["admin"]),
    adaptRoute(makeDeleteRegisterByIdController()),
  );
};
