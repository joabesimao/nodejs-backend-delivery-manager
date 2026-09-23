import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { DeliverymanCpfDuplicateValidatorAdapter } from "../../utils/deliveryman-cpf-duplicate-validator-adapter";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddDeliverymanValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "lastName", "numberQualification", "phone", "cpf"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CpfDuplicateValidation(new DeliverymanCpfDuplicateValidatorAdapter(prisma))
  );
  return new ValidationComposite(validations);
};
