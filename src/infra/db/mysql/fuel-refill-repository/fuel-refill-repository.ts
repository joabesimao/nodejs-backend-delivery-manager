import { PrismaClient } from "@prisma/client";
import { AddFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/add-fuel-refill";
import { FindLastFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/find-last-fuel-refill";
import { LoadFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/load-fuel-refill";
import { FindFuelRefillByIdRepository } from "../../../../data/protocols/db/fuel-refill/find-fuel-refill-by-id";
import { UpdateFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/update-fuel-refill";
import { DeleteFuelRefillRepository } from "../../../../data/protocols/db/fuel-refill/delete-fuel-refill";
import { RecalculateFuelRefillKmRepository } from "../../../../data/protocols/db/fuel-refill/recalculate-fuel-refill-km";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { LoadFuelRefillParams } from "../../../../domain/usescases/fuel-refill/load-fuel-refill";
import { UpdateFuelRefillModel } from "../../../../domain/usescases/fuel-refill/update-fuel-refill";

type DecimalLike = { toString(): string } | number;

const toFuelRefill = <T extends { liters: DecimalLike; totalValue: DecimalLike; pricePerLiter: DecimalLike | null }>(
  result: T
) => ({
  ...result,
  liters: Number(result.liters),
  totalValue: Number(result.totalValue),
  pricePerLiter: result.pricePerLiter === null ? null : Number(result.pricePerLiter),
});

export class FuelRefillMysqlRepository
  implements
    AddFuelRefillRepository,
    FindLastFuelRefillRepository,
    LoadFuelRefillRepository,
    FindFuelRefillByIdRepository,
    UpdateFuelRefillRepository,
    DeleteFuelRefillRepository,
    RecalculateFuelRefillKmRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(data: {
    vehicleId: number;
    deliverymanId: number;
    km: number;
    previousKm?: number;
    kmDriven?: number;
    liters: number;
    pricePerLiter: number;
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
        pricePerLiter: data.pricePerLiter,
        totalValue: data.totalValue,
        refillDate: data.refillDate,
      },
      include: { vehicle: true, deliveryman: true },
    });
    return toFuelRefill(result);
  }

  async findLastByVehicle(vehicleId: number): Promise<FuelRefill | null> {
    const result = await this.prisma.fuelRefill.findFirst({
      where: { vehicleId },
      orderBy: [{ refillDate: "desc" }, { id: "desc" }],
    });
    return result && toFuelRefill(result);
  }

  async findById(id: number): Promise<FuelRefill | null> {
    const result = await this.prisma.fuelRefill.findUnique({
      where: { id: Number(id) },
      include: { vehicle: true, deliveryman: true },
    });
    return result && toFuelRefill(result);
  }

  async loadAll(params?: LoadFuelRefillParams): Promise<FuelRefill[]> {
    const results = await this.prisma.fuelRefill.findMany({
      where: {
        ...(params?.vehicleId && { vehicleId: params.vehicleId }),
        ...(params?.deliverymanId && { deliverymanId: params.deliverymanId }),
      },
      include: { vehicle: true, deliveryman: true },
      orderBy: [{ refillDate: "desc" }, { id: "desc" }],
    });
    return results.map(toFuelRefill);
  }

  async update(id: number, data: UpdateFuelRefillModel): Promise<void> {
    await this.prisma.fuelRefill.update({
      where: { id: Number(id) },
      data: {
        ...(data.vehicleId !== undefined && { vehicleId: data.vehicleId }),
        ...(data.deliverymanId !== undefined && { deliverymanId: data.deliverymanId }),
        ...(data.km !== undefined && { km: data.km }),
        ...(data.liters !== undefined && { liters: data.liters }),
        ...(data.pricePerLiter !== undefined && { pricePerLiter: data.pricePerLiter }),
        ...(data.totalValue !== undefined && { totalValue: data.totalValue }),
        ...(data.refillDate !== undefined && { refillDate: data.refillDate }),
      },
    });
  }

  async deleteOne(id: number): Promise<void> {
    await this.prisma.fuelRefill.delete({ where: { id: Number(id) } });
  }

  async recalculateKmChain(vehicleId: number): Promise<void> {
    const refills = await this.prisma.fuelRefill.findMany({
      where: { vehicleId },
      orderBy: [{ refillDate: "asc" }, { id: "asc" }],
      select: { id: true, km: true, previousKm: true, kmDriven: true },
    });
    const updates = refills
      .map((refill, index) => {
        const previousKm = index > 0 ? refills[index - 1].km : null;
        const kmDriven = previousKm !== null ? refill.km - previousKm : null;
        return { refill, previousKm, kmDriven };
      })
      .filter(({ refill, previousKm, kmDriven }) => refill.previousKm !== previousKm || refill.kmDriven !== kmDriven)
      // PrismaPromise precisa continuar lazy para rodar dentro do $transaction em lote
      .map(({ refill, previousKm, kmDriven }) =>
        this.prisma.fuelRefill.update({ where: { id: refill.id }, data: { previousKm, kmDriven } })
      );
    if (updates.length > 0) {
      await this.prisma.$transaction(updates);
    }
  }
}
