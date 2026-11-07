import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";
import {
  isForeignKeyViolation,
  isPrismaKnownError,
  rethrowDeleteError,
} from "./prisma-errors";

const makeKnownError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("x", { code, clientVersion: "6.7.0" });

describe("prisma-errors", () => {
  test("isPrismaKnownError reconhece apenas PrismaClientKnownRequestError", () => {
    expect(isPrismaKnownError(makeKnownError("P2025"))).toBe(true);
    expect(isPrismaKnownError(new Error())).toBe(false);
    expect(isPrismaKnownError(undefined)).toBe(false);
  });

  test("isForeignKeyViolation reconhece apenas o código P2003", () => {
    expect(isForeignKeyViolation(makeKnownError("P2003"))).toBe(true);
    expect(isForeignKeyViolation(makeKnownError("P2025"))).toBe(false);
    expect(isForeignKeyViolation(new Error())).toBe(false);
  });

  test("rethrowDeleteError converte P2003 em ResourceInUseError", () => {
    expect(() => rethrowDeleteError(makeKnownError("P2003"))).toThrow(ResourceInUseError);
  });

  test("rethrowDeleteError converte os demais erros conhecidos em NotFoundError", () => {
    expect(() => rethrowDeleteError(makeKnownError("P2025"))).toThrow(NotFoundError);
  });

  test("rethrowDeleteError relança outros erros sem alterar", () => {
    const error = new Error("db down");
    expect(() => rethrowDeleteError(error)).toThrow(error);
  });
});
