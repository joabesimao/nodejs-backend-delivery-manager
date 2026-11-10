import { prisma } from "../../../infra/db/prisma/client";
import { AddressMysqlRepository } from "../../../infra/db/mysql/address-repository/address-repository";

export const makeAddressRepository = (): AddressMysqlRepository => new AddressMysqlRepository(prisma);
