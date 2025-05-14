import { DbLoadAccountByToken } from "../../data/usescases/account-usescases/load-account-by-token/db-load-account-by-token";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-repository";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../presentation/protocols/middleware";
import env from "../../env";

export const makeAuthMiddleware = (role?: string): Middleware => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAccountByToken = new DbLoadAccountByToken(
    jwtAdapter,
    accountMongoRepository
  );
  return new AuthMiddleware(dbAccountByToken, role);
};
