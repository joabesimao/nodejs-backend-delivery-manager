import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export interface CpfDuplicateValidator {
  validate(cpf: string): Promise<boolean>;
}

export class CpfDuplicateValidation implements Validation {
  constructor(private readonly cpfValidator: CpfDuplicateValidator) {}

  async validate(input: any): Promise<Error | null> {
    const cpf = input.cpf || (input.client && input.client.cpf);
    
    if (!cpf) {
      return null;
    }

    const cpfClean = cpf.replace(/\D/g, "");
    const isCpfDuplicate = await this.cpfValidator.validate(cpfClean);
    
    if (isCpfDuplicate) {
      return new InvalidParamError("cpf");
    }

    return null;
  }
}
