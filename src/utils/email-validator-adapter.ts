import { EmailValidator } from "../presentation/protocols/email-validator";
import validator from "validator";

export class EmailValidatorAdapter implements EmailValidator {
  async isValid(email: string): Promise<boolean> {
    return validator.isEmail(email);
  }
}
