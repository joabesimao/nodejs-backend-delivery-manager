import { PrismaClient } from "@prisma/client";
import { CpfDuplicateValidator } from "../presentation/helpers/validators/cpf-duplicate-validation";

export class CpfDuplicateValidatorAdapter implements CpfDuplicateValidator {
  constructor(private readonly prisma: PrismaClient) {}

  async validate(cpf: string): Promise<boolean> {
    const existingClient = await this.prisma.client.findFirst({
      where: { cpf: cpf.replace(/\D/g, "") },
    });
    return !!existingClient;
  }
}
