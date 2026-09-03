import {
  ValidationComposite,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";

export const makeUpdateDeliverymanValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  return new ValidationComposite(validations);
};
