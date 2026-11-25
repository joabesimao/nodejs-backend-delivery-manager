import { prisma } from "../../../infra/db/prisma/client";
import { RegisterMySqlRepository } from "../../../infra/db/prisma/register-repository/register-mysql-repository";

export const makeRegisterRepository = (): RegisterMySqlRepository => new RegisterMySqlRepository(prisma);
