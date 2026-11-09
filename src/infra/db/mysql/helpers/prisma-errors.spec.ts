import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";
import { CpfInUseError, PlateInUseError } from "../../../../domain/errors";
import {
  isForeignKeyViolation,
  isPrismaKnownError,
  rethrowDeleteError,
  rethrowUniqueError,
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

  const makeUniqueError = (target?: unknown) =>
    new Prisma.PrismaClientKnownRequestError("x", {
      code: "P2002",
      clientVersion: "6.7.0",
      meta: target === undefined ? undefined : { target },
    });
  const errorsByField = {
    cpf: () => new CpfInUseError(),
    plate: () => new PlateInUseError(),
  };

  test("rethrowUniqueError converte P2002 no campo mapeado no erro correspondente", () => {
    expect(() => rethrowUniqueError(makeUniqueError(["cpf"]), errorsByField)).toThrow(CpfInUseError);
    expect(() => rethrowUniqueError(makeUniqueError(["plate"]), errorsByField)).toThrow(PlateInUseError);
  });

  test("rethrowUniqueError aceita target como nome do índice", () => {
    expect(() => rethrowUniqueError(makeUniqueError("Client_cpf_key"), errorsByField)).toThrow(
      CpfInUseError,
    );
  });

  test("rethrowUniqueError relança P2002 de outro campo ou sem meta sem alterar", () => {
    const otherField = makeUniqueError(["name"]);
    const withoutMeta = makeUniqueError();
    expect(() => rethrowUniqueError(otherField, errorsByField)).toThrow(otherField);
    expect(() => rethrowUniqueError(withoutMeta, errorsByField)).toThrow(withoutMeta);
  });

  test("rethrowUniqueError relança outros erros sem alterar", () => {
    const knownError = makeKnownError("P2003");
    const error = new Error("db down");
    expect(() => rethrowUniqueError(knownError, errorsByField)).toThrow(knownError);
    expect(() => rethrowUniqueError(error, errorsByField)).toThrow(error);
  });
});
