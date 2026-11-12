import { DbLoadAccountByToken } from "../../data/usescases/account-usecases/load-account-by-token/db-load-account-by-token";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { LoadAccountByToken } from "../../domain/usescases/auth-middleware/load-account-by-token";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../presentation/protocols/middleware";
import { env } from "../../../config/Env";
import { makeAccountRepository } from "./repositories";

export const makeDbLoadAccountByToken = (): LoadAccountByToken =>
  new DbLoadAccountByToken(new JwtAdapter(env.JWT_SECRET), makeAccountRepository());

export const makeAuthMiddleware = (roles?: string[]): Middleware =>
  new AuthMiddleware(makeDbLoadAccountByToken(), roles);
