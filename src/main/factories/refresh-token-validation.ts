import {
  RequireFieldsValidation,
  ValidationComposite,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeRefreshTokenValidation = (): Validation => {
  const validations = [new RequireFieldsValidation("refreshToken")];
  return new ValidationComposite(validations);
};