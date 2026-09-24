import { PlateInUseError } from "../../errors";
import { Validation } from "../../protocols/validation";

export interface PlateDuplicateValidator {
  validate(plate: string): Promise<boolean>;
}

export class PlateDuplicateValidation implements Validation {
  constructor(private readonly plateValidator: PlateDuplicateValidator) {}

  async validate(input: any): Promise<Error | null> {
    const plate = input.plate;

    if (!plate) {
      return null;
    }

    const isPlateDuplicate = await this.plateValidator.validate(plate);

    if (isPlateDuplicate) {
      return new PlateInUseError();
    }

    return null;
  }
}
