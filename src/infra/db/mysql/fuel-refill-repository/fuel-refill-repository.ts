import { PrismaClient } from "@prisma/client";
import { AddFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/add-fuel-refill";
import { FindLastFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/find-last-fuel-refill";
import { LoadFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/load-fuel-refill";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { LoadFuelRefillParams } from "../../../../domain/usescases/fuel-refill/load-fuel-refill";

export class FuelRefillMysqlRepository
  implements AddFuelRefillRepository, FindLastFuelRefillRepository, LoadFuelRefillRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async add(data: {
    vehicleId: number;
    deliverymanId: number;
    km: number;
    previousKm?: number;
    kmDriven?: number;
    liters: number;
    totalValue: number;
    refillDate: Date;
  }): Promise<FuelRefill> {
    const result = await this.prisma.fuelRefill.create({
      data: {
        vehicleId: data.vehicleId,
        deliverymanId: data.deliverymanId,
        km: data.km,
        previousKm: data.previousKm,
        kmDriven: data.kmDriven,
        liters: data.liters,
        totalValue: data.totalValue,
        refillDate: data.refillDate,
      },
      include: { vehicle: true, deliveryman: true },
    });
    return { ...result, liters: Number(result.liters), totalValue: Number(result.totalValue) };
  }

  async findLastByVehicle(vehicleId: number): Promise<FuelRefill | null> {
    const result = await this.prisma.fuelRefill.findFirst({
      where: { vehicleId },
      orderBy: { refillDate: "desc" },
    });
    return result && { ...result, liters: Number(result.liters), totalValue: Number(result.totalValue) };
  }

  async loadAll(params?: LoadFuelRefillParams): Promise<FuelRefill[]> {
    const results = await this.prisma.fuelRefill.findMany({
      where: {
        ...(params?.vehicleId && { vehicleId: params.vehicleId }),
        ...(params?.deliverymanId && { deliverymanId: params.deliverymanId }),
      },
      include: { vehicle: true, deliveryman: true },
      orderBy: { refillDate: "desc" },
    });
    return results.map((result) => ({
      ...result,
      liters: Number(result.liters),
      totalValue: Number(result.totalValue),
    }));
  }
}
