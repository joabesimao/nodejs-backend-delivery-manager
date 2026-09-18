import {
  ValidationComposite,
  RequireFieldsValidation,
  OptionalFieldTypeValidation,
  ProductVariationsValidation,
  ProductImageValidation,
  BarcodeDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { prisma } from "../../infra/db/mysql/helpers";
import { BarcodeDuplicateValidatorAdapter } from "../../utils/barcode-duplicate-validator-adapter";

export const makeAddProductValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "price", "description", "category"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new OptionalFieldTypeValidation("subcategory", "string"),
    new OptionalFieldTypeValidation("brand", "string"),
    new OptionalFieldTypeValidation("model", "string"),
    new OptionalFieldTypeValidation("unit", "string"),
    new OptionalFieldTypeValidation("barcode", "string"),
    new OptionalFieldTypeValidation("status", "boolean"),
    new OptionalFieldTypeValidation("notes", "string"),
    new ProductVariationsValidation(),
    new ProductImageValidation(),
    new BarcodeDuplicateValidation(new BarcodeDuplicateValidatorAdapter(prisma))
  );
  return new ValidationComposite(validations);
};
