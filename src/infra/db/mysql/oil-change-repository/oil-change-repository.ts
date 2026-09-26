import { PrismaClient } from "@prisma/client";
import { AddOilChangeLogRepository } from "../../../../data/protocols/db/oil-change/add-oil-change-log";
import { FindLastOilChangeLogRepository } from "../../../../data/protocols/db/oil-change/find-last-oil-change-log";
import { LoadOilChangeConfigRepository } from "../../../../data/protocols/db/oil-change/load-oil-change-config";
import { LoadOilChangeLogRepository } from "../../../../data/protocols/db/oil-change/load-oil-change-log";
import { FindOilChangeLogByIdRepository } from "../../../../data/protocols/db/oil-change/find-oil-change-log-by-id";
import { UpdateOilChangeLogRepository } from "../../../../data/protocols/db/oil-change/update-oil-change-log";
import { DeleteOilChangeLogRepository } from "../../../../data/protocols/db/oil-change/delete-oil-change-log";
import { UpdateOilChangeConfigRepository } from "../../../../data/protocols/db/oil-change/update-oil-change-config";
import { OilChangeConfig } from "../../../../domain/models/oil-change/oil-change-config-model";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { LoadOilChangeLogParams } from "../../../../domain/usescases/oil-change/load-oil-change-log";
import { UpdateOilChangeLogModel } from "../../../../domain/usescases/oil-change/update-oil-change-log";

const DEFAULT_INTERVAL_KM = 800;
const CONFIG_ID = 1;

export class OilChangeMysqlRepository
  implements
    LoadOilChangeConfigRepository,
    UpdateOilChangeConfigRepository,
    AddOilChangeLogRepository,
    FindLastOilChangeLogRepository,
    LoadOilChangeLogRepository,
    FindOilChangeLogByIdRepository,
    UpdateOilChangeLogRepository,
    DeleteOilChangeLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async load(): Promise<OilChangeConfig> {
    return await this.prisma.oilChangeConfig.upsert({
      where: { id: CONFIG_ID },
      update: {},
      create: { id: CONFIG_ID, intervalKm: DEFAULT_INTERVAL_KM },
    });
  }

  async upsert(intervalKm: number): Promise<OilChangeConfig> {
    return await this.prisma.oilChangeConfig.upsert({
      where: { id: CONFIG_ID },
      update: { intervalKm },
      create: { id: CONFIG_ID, intervalKm },
    });
  }

  async add(data: {
    vehicleId: number;
    deliverymanId: number;
    km: number;
    nextChangeKm: number;
    changeDate: Date;
  }): Promise<OilChangeLog> {
    return await this.prisma.oilChangeLog.create({
      data: {
        vehicleId: data.vehicleId,
        deliverymanId: data.deliverymanId,
        km: data.km,
        nextChangeKm: data.nextChangeKm,
        changeDate: data.changeDate,
      },
      include: { vehicle: true, deliveryman: true },
    });
  }

  async findLastByVehicle(vehicleId: number): Promise<OilChangeLog | null> {
    return await this.prisma.oilChangeLog.findFirst({
      where: { vehicleId },
      orderBy: [{ changeDate: "desc" }, { id: "desc" }],
    });
  }

  async loadAll(params?: LoadOilChangeLogParams): Promise<OilChangeLog[]> {
    return await this.prisma.oilChangeLog.findMany({
      where: {
        ...(params?.vehicleId && { vehicleId: params.vehicleId }),
        ...(params?.deliverymanId && { deliverymanId: params.deliverymanId }),
      },
      include: { vehicle: true, deliveryman: true },
      orderBy: [{ changeDate: "desc" }, { id: "desc" }],
    });
  }

  async findLogById(id: number): Promise<OilChangeLog | null> {
    return await this.prisma.oilChangeLog.findUnique({
      where: { id: Number(id) },
      include: { vehicle: true, deliveryman: true },
    });
  }

  async updateLog(id: number, data: UpdateOilChangeLogModel & { nextChangeKm: number }): Promise<OilChangeLog> {
    return await this.prisma.oilChangeLog.update({
      where: { id: Number(id) },
      data: {
        ...(data.vehicleId !== undefined && { vehicleId: data.vehicleId }),
        ...(data.deliverymanId !== undefined && { deliverymanId: data.deliverymanId }),
        ...(data.km !== undefined && { km: data.km }),
        ...(data.changeDate !== undefined && { changeDate: data.changeDate }),
        nextChangeKm: data.nextChangeKm,
      },
      include: { vehicle: true, deliveryman: true },
    });
  }

  async deleteLog(id: number): Promise<void> {
    await this.prisma.oilChangeLog.delete({ where: { id: Number(id) } });
  }
}
