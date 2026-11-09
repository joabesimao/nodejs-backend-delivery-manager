import { CpfInUseError } from "../../../domain/errors";
import { Validation } from "../../protocols/validation";

export interface CpfDuplicateValidator {
  existsByCpf(cpf: string): Promise<boolean>;
}

export class CpfDuplicateValidation implements Validation {
  constructor(private readonly cpfValidator: CpfDuplicateValidator) {}

  async validate(input: any): Promise<Error | null> {
    const cpf = input.cpf || (input.client?.cpf);

    if (!cpf) {
      return null;
    }

    const cpfClean = cpf.replace(/\D/g, "");
    const isCpfDuplicate = await this.cpfValidator.existsByCpf(cpfClean);

    if (isCpfDuplicate) {
      return new CpfInUseError();
    }

    return null;
  }
}
