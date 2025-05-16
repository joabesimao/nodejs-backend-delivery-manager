import env from "../../env";
import { DbAuthentication } from "../../data/usescases/authentication/db-authentication";
import { Authentication } from "../../domain/usescases/authentication/authentication";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account-repository";
import { AccountMySqlRepository } from "../../infra/db/mysql/account-repository/account-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwt = new JwtAdapter(env.jwtSecret);
  const accountMysqlRepository = new AccountMySqlRepository(prisma);
  return new DbAuthentication(
    accountMysqlRepository,
    bcryptAdapter,
    jwt,
    accountMysqlRepository
  );
};
