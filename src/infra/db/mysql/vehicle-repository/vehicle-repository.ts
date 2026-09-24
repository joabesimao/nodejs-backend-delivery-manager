import { PrismaClient } from "@prisma/client";
import { AddVehicleRepository } from "../../../../data/protocols/db/vehicle/add-vehicle";
import { DeleteVehicleRepository } from "../../../../data/protocols/db/vehicle/delete-vehicle";
import { LoadVehicleRepository } from "../../../../data/protocols/db/vehicle/load-vehicle";
import { UpdateVehicleRepository } from "../../../../data/protocols/db/vehicle/update-vehicle";
import { Vehicle } from "../../../../domain/models/vehicle/vehicle-model";
import { AddVehicleModel } from "../../../../domain/usescases/vehicle/add-vehicle";

export class VehicleMysqlRepository
  implements LoadVehicleRepository, AddVehicleRepository, UpdateVehicleRepository, DeleteVehicleRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async loadAll(): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      orderBy: { plate: "asc" },
    });
  }

  async add(vehicle: AddVehicleModel): Promise<Vehicle> {
    return this.prisma.vehicle.create({
      data: {
        plate: vehicle.plate,
        model: vehicle.model,
        brand: vehicle.brand,
        deliverymanId: vehicle.deliverymanId,
      },
    });
  }

  async update(id: number, data: Partial<Vehicle>): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id: Number(id) },
      data: {
        ...(data.plate && { plate: data.plate }),
        ...(data.model && { model: data.model }),
        ...(data.brand !== undefined && { brand: data.brand }),
        ...(data.deliverymanId !== undefined && { deliverymanId: data.deliverymanId }),
      },
    });
  }

  async deleteOne(id: number): Promise<string> {
    await this.prisma.vehicle.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }
}
