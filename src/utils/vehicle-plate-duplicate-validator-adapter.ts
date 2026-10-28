import { PrismaClient } from "@prisma/client";
import { PlateDuplicateValidator } from "../presentation/helpers/validators/plate-duplicate-validation";

export class VehiclePlateDuplicateValidatorAdapter implements PlateDuplicateValidator {
  constructor(private readonly prisma: PrismaClient) {}

  async validate(plate: string): Promise<boolean> {
    const existingVehicle = await this.prisma.vehicle.findFirst({
      where: { plate },
    });
    return !!existingVehicle;
  }
}
