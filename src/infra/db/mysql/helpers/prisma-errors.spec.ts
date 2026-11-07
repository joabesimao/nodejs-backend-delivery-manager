import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { isPrismaKnownError, rethrowAsNotFound } from "./prisma-errors";

const makeKnownError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError("x", { code, clientVersion: "6.7.0" });

describe("prisma-errors", () => {
  test("isPrismaKnownError reconhece apenas PrismaClientKnownRequestError", () => {
    expect(isPrismaKnownError(makeKnownError("P2025"))).toBe(true);
    expect(isPrismaKnownError(new Error())).toBe(false);
    expect(isPrismaKnownError(undefined)).toBe(false);
  });

  test("rethrowAsNotFound converte erro conhecido do Prisma em NotFoundError", () => {
    expect(() => rethrowAsNotFound(makeKnownError("P2025"))).toThrow(NotFoundError);
  });

  test("rethrowAsNotFound relança outros erros sem alterar", () => {
    const error = new Error("db down");
    expect(() => rethrowAsNotFound(error)).toThrow(error);
  });
});
