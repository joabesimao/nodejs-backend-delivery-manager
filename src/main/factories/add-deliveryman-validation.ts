import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
  QualificationDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { makeDeliverymanRepository } from "./repositories";

export const makeAddDeliverymanValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "lastName", "numberQualification", "phone", "cpf"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  const deliverymanRepository = makeDeliverymanRepository();
  validations.push(new CpfDuplicateValidation(deliverymanRepository));
  validations.push(new QualificationDuplicateValidation(deliverymanRepository));
  return new ValidationComposite(validations);
};
