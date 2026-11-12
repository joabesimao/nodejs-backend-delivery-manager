import { PrismaClient } from "@prisma/client";
import { LoadUnitStoresByIdsRepository } from "../../../../data/protocols/db/unit-store/load-unit-stores-by-ids-repository";
import { UnitStoreSummary } from "../../../../domain/models/store/unit-store-summary";

export class UnitStoreMysqlRepository implements LoadUnitStoresByIdsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadByIds(ids: number[]): Promise<UnitStoreSummary[]> {
    return await this.prisma.unitStore.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, parentStoreId: true, isMain: true },
      orderBy: { id: "asc" },
    });
  }
}
