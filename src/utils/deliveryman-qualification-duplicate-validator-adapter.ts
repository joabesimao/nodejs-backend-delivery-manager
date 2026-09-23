import { PrismaClient } from "@prisma/client";
import { QualificationDuplicateValidator } from "../presentation/helpers/validators/qualification-duplicate-validation";

export class DeliverymanQualificationDuplicateValidatorAdapter implements QualificationDuplicateValidator {
  constructor(private readonly prisma: PrismaClient) {}

  async validate(numberQualification: string): Promise<boolean> {
    const existingDeliveryman = await this.prisma.deliveryman.findFirst({
      where: { numberQualification },
    });
    return !!existingDeliveryman;
  }
}
