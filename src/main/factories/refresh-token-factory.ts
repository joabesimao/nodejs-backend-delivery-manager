import { env } from "../../../config/Env";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { prisma } from "../../infra/db/mysql/helpers";
import { RefreshTokenController } from "../../presentation/controllers/account-controllers/refresh-token/refresh-token";
import { Controller } from "../../presentation/protocols/controller";
import { makeRefreshTokenValidation } from "./refresh-token-validation";

export const makeRefreshTokenController = (): Controller => {
  const validation = makeRefreshTokenValidation();
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const accountRepository = new AccountMySqlRepository(prisma);

  return new RefreshTokenController(validation, jwtAdapter, accountRepository);
};