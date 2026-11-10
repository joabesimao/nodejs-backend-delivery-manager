import { DbLoadAccountByToken } from "../../data/usescases/account-usecases/load-account-by-token/db-load-account-by-token";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../presentation/protocols/middleware";
import { env } from "../../../config/Env";
import { makeAccountRepository } from "./repositories";

export const makeAuthMiddleware = (roles?: string[]): Middleware => {
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const accountMySqlRepository = makeAccountRepository();
  const dbAccountByToken = new DbLoadAccountByToken(
    jwtAdapter,
    accountMySqlRepository,
  );
  return new AuthMiddleware(dbAccountByToken, roles);
};
