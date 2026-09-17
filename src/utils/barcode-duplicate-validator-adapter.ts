import { PrismaClient } from "@prisma/client";
import { BarcodeDuplicateValidator } from "../presentation/helpers/validators/barcode-duplicate-validation";

export class BarcodeDuplicateValidatorAdapter implements BarcodeDuplicateValidator {
  constructor(private readonly prisma: PrismaClient) {}

  async validate(barcode: string): Promise<boolean> {
    const existingProduct = await this.prisma.product.findFirst({
      where: { barcode },
    });
    return !!existingProduct;
  }
}
