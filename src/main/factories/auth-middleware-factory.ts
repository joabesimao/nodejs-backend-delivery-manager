import { DbLoadAccountByToken } from "../../data/usescases/account-usecases/load-account-by-token/db-load-account-by-token";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { AuthMiddleware } from "../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../presentation/protocols/middleware";
import { env } from "../../../config/Env";
import { prisma } from "../../infra/db/mysql/helpers";

export const makeAuthMiddleware = (role?: string): Middleware => {
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const accountMySqlRepository = new AccountMySqlRepository(prisma);
  const dbAccountByToken = new DbLoadAccountByToken(
    jwtAdapter,
    accountMySqlRepository,
  );
  return new AuthMiddleware(dbAccountByToken, role);
};
