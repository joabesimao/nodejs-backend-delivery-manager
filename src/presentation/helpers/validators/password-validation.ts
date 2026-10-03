import { InvalidParamError, WeakPasswordError } from "../../errors";
import { Validation } from "../../protocols/validation";

export const PASSWORD_MIN_LENGTH = 8;
// bcrypt ignora tudo que passa de 72 bytes.
export const PASSWORD_MAX_BYTES = 72;

export class PasswordValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly optional = false
  ) {}

  validate(input: any): Error {
    const value = input[this.fieldName];
    if (this.optional && (value === undefined || value === null || value === "")) return;

    if (typeof value !== "string") {
      return new InvalidParamError(this.fieldName);
    }
    if (
      value.length < PASSWORD_MIN_LENGTH ||
      Buffer.byteLength(value, "utf8") > PASSWORD_MAX_BYTES
    ) {
      return new WeakPasswordError();
    }
  }
}
