import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";

const FOREIGN_KEY_VIOLATION = "P2003";
const UNIQUE_CONSTRAINT_VIOLATION = "P2002";

export const isPrismaKnownError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

export const isForeignKeyViolation = (error: unknown): boolean =>
  isPrismaKnownError(error) && error.code === FOREIGN_KEY_VIOLATION;

export function rethrowDeleteError(error: unknown): never {
  if (isForeignKeyViolation(error)) {
    throw new ResourceInUseError();
  }
  if (isPrismaKnownError(error)) {
    throw new NotFoundError();
  }
  throw error;
}

const uniqueTargetIncludes = (
  error: Prisma.PrismaClientKnownRequestError,
  field: string,
): boolean => {
  const target = error.meta?.target;
  return (typeof target === "string" || Array.isArray(target)) && target.includes(field);
};

export function rethrowUniqueError(
  error: unknown,
  errorsByField: Record<string, () => Error>,
): never {
  if (isPrismaKnownError(error) && error.code === UNIQUE_CONSTRAINT_VIOLATION) {
    const field = Object.keys(errorsByField).find((key) => uniqueTargetIncludes(error, key));
    if (field) {
      throw errorsByField[field]();
    }
  }
  throw error;
}
