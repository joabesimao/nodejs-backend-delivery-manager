import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

type FieldType = "string" | "number" | "boolean";

export class OptionalFieldTypeValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldType: FieldType
  ) {}

  validate(input: any): Error {
    const value = input[this.fieldName];
    if (value === undefined || value === null) return;

    if (this.fieldType === "string" && (typeof value !== "string" || value.trim() === "")) {
      return new InvalidParamError(this.fieldName);
    }
    if (this.fieldType === "number" && (typeof value !== "number" || isNaN(value) || value <= 0)) {
      return new InvalidParamError(this.fieldName);
    }
    if (this.fieldType === "boolean" && typeof value !== "boolean") {
      return new InvalidParamError(this.fieldName);
    }
  }
}
