import { prisma } from "../../../infra/db/prisma/client";
import { CityMysqlRepository } from "../../../infra/db/mysql/city-repository/city-repository";

export const makeCityRepository = (): CityMysqlRepository => new CityMysqlRepository(prisma);
