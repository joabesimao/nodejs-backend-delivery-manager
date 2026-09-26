import { EmailValidator } from "../presentation/protocols/email-validator";
import validator from "validator";

export class EmailValidatorAdapter implements EmailValidator {
  async isValid(email: unknown): Promise<boolean> {
    return typeof email === "string" && validator.isEmail(email);
  }
}
