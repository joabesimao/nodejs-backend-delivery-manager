export interface EmailValidator {
  isValid(email: unknown): Promise<boolean>;
}
