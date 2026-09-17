import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export interface BarcodeDuplicateValidator {
  validate(barcode: string): Promise<boolean>;
}

export class BarcodeDuplicateValidation implements Validation {
  constructor(private readonly barcodeValidator: BarcodeDuplicateValidator) {}

  async validate(input: any): Promise<Error | null> {
    const barcode = input.barcode;

    if (!barcode) {
      return null;
    }

    const isDuplicate = await this.barcodeValidator.validate(barcode);

    if (isDuplicate) {
      return new InvalidParamError("barcode");
    }

    return null;
  }
}
