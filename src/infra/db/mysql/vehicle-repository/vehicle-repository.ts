import { PrismaClient } from "@prisma/client";
import { AddVehicleRepository } from "../../../../data/protocols/db/vehicle/add-vehicle";
import { DeleteVehicleRepository } from "../../../../data/protocols/db/vehicle/delete-vehicle";
import { LoadVehicleRepository } from "../../../../data/protocols/db/vehicle/load-vehicle";
import { UpdateVehicleRepository } from "../../../../data/protocols/db/vehicle/update-vehicle";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { AddVehicleModel } from "../../../../domain/usescases/vehicle/add-vehicle";
import { PlateInUseError, VehicleInUseError } from "../../../../domain/errors";
import { isForeignKeyViolation, rethrowUniqueError } from "../helpers/prisma-errors";

export class VehicleMysqlRepository
  implements LoadVehicleRepository, AddVehicleRepository, UpdateVehicleRepository, DeleteVehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Vehicle[]> {
    return await this.prisma.vehicle.findMany({
      orderBy: { plate: "asc" },
    });
  }

  async add(vehicle: AddVehicleModel): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.create({
        data: {
          plate: vehicle.plate,
          model: vehicle.model,
          brand: vehicle.brand,
          deliverymanId: vehicle.deliverymanId,
        },
      });
    } catch (error) {
      rethrowUniqueError(error, { plate: () => new PlateInUseError() });
    }
  }

  async update(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
    try {
      return await this.prisma.vehicle.update({
        where: { id: Number(id) },
        data: {
          ...(data.plate && { plate: data.plate }),
          ...(data.model && { model: data.model }),
          ...(data.brand !== undefined && { brand: data.brand }),
          ...(data.deliverymanId !== undefined && { deliverymanId: data.deliverymanId }),
        },
      });
    } catch (error) {
      rethrowUniqueError(error, { plate: () => new PlateInUseError() });
    }
  }

  async deleteOne(id: number): Promise<string> {
    try {
      await this.prisma.vehicle.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new VehicleInUseError();
      }
      throw error;
    }
    return "Deletado com sucesso!";
  }
}
