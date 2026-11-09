import {
  ValidationComposite,
  RequireFieldsValidation,
  CpfDuplicateValidation,
  QualificationDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { DeliverymanMysqlRepository } from "../../infra/db/mysql/deliveryman-repository/deliveryman-repository";
import { prisma } from "../../infra/db/mysql/helpers/index";

export const makeAddDeliverymanValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "lastName", "numberQualification", "phone", "cpf"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  const deliverymanRepository = new DeliverymanMysqlRepository(prisma);
  validations.push(new CpfDuplicateValidation(deliverymanRepository));
  validations.push(new QualificationDuplicateValidation(deliverymanRepository));
  return new ValidationComposite(validations);
};
