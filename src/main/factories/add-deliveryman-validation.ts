import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
  QualificationDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { DeliverymanCpfDuplicateValidatorAdapter } from "../../utils/deliveryman-cpf-duplicate-validator-adapter";
import { DeliverymanQualificationDuplicateValidatorAdapter } from "../../utils/deliveryman-qualification-duplicate-validator-adapter";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddDeliverymanValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "lastName", "numberQualification", "phone", "cpf"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new CpfDuplicateValidation(new DeliverymanCpfDuplicateValidatorAdapter(prisma))
  );
  validations.push(
    new QualificationDuplicateValidation(new DeliverymanQualificationDuplicateValidatorAdapter(prisma))
  );
  return new ValidationComposite(validations);
};
