import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";

const FOREIGN_KEY_VIOLATION = "P2003";

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
