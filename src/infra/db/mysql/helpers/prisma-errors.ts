import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";

export const isPrismaKnownError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

export function rethrowAsNotFound(error: unknown): never {
  if (isPrismaKnownError(error)) {
    throw new NotFoundError();
  }
  throw error;
}
