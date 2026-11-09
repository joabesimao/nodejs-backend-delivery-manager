import {
  ValidationComposite,
  RequireFieldsValidation,
  PositiveNumberValidation,
  OptionalFieldTypeValidation,
  ProductVariationsValidation,
  ProductImageValidation,
  BarcodeDuplicateValidation,
} from "../../presentation/helpers/validators";
import { Validation } from "../../presentation/protocols/validation";
import { prisma } from "../../infra/db/mysql/helpers";
import { ProductMysqlRepository } from "../../infra/db/mysql/product-repository/product-repository";

export const makeAddProductValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "price", "description", "category"]) {
    validations.push(new RequireFieldsValidation(field));
  }
  validations.push(
    new PositiveNumberValidation("price"),
    new OptionalFieldTypeValidation("subcategory", "string"),
    new OptionalFieldTypeValidation("brand", "string"),
    new OptionalFieldTypeValidation("model", "string"),
    new OptionalFieldTypeValidation("unit", "string"),
    new OptionalFieldTypeValidation("barcode", "string"),
    new OptionalFieldTypeValidation("status", "boolean"),
    new OptionalFieldTypeValidation("notes", "string"),
    new ProductVariationsValidation(),
    new ProductImageValidation(),
    new BarcodeDuplicateValidation(new ProductMysqlRepository(prisma))
  );
  return new ValidationComposite(validations);
};
