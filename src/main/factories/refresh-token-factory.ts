import { env } from "../../../config/Env";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { RefreshTokenController } from "../../presentation/controllers/account-controllers/refresh-token/refresh-token";
import { Controller } from "../../presentation/protocols/controller";
import { makeRefreshTokenValidation } from "./refresh-token-validation";
import { makeAccountRepository } from "./repositories";

export const makeRefreshTokenController = (): Controller => {
  const validation = makeRefreshTokenValidation();
  const jwtAdapter = new JwtAdapter(env.JWT_SECRET);
  const accountRepository = makeAccountRepository();

  return new RefreshTokenController(
    validation,
    jwtAdapter,
    accountRepository,
    env.JWT_ACCESS_EXPIRES_IN,
    env.JWT_REFRESH_EXPIRES_IN,
  );
};
