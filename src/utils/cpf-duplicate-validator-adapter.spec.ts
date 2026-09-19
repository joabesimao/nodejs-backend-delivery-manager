import { PrismaClient } from "@prisma/client";
import { CpfDuplicateValidatorAdapter } from "./cpf-duplicate-validator-adapter";

const makePrismaStub = (): PrismaClient => {
  return {
    client: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  } as unknown as PrismaClient;
};

interface SutTypes {
  sut: CpfDuplicateValidatorAdapter;
  prismaStub: PrismaClient;
}

const makeSut = (): SutTypes => {
  const prismaStub = makePrismaStub();
  const sut = new CpfDuplicateValidatorAdapter(prismaStub);
  return { sut, prismaStub };
};

describe("CpfDuplicateValidator Adapter", () => {
  test("Should call prisma.client.findFirst with the cleaned cpf", async () => {
    const { sut, prismaStub } = makeSut();
    const findFirstSpy = jest.spyOn(prismaStub.client, "findFirst");
    await sut.validate("123.456.789-00");
    expect(findFirstSpy).toHaveBeenCalledWith({
      where: { cpf: "12345678900" },
    });
  });

  test("Should return false if no client is found", async () => {
    const { sut } = makeSut();
    const isDuplicate = await sut.validate("12345678900");
    expect(isDuplicate).toBe(false);
  });

  test("Should return true if a client is found", async () => {
    const { sut, prismaStub } = makeSut();
    jest
      .spyOn(prismaStub.client, "findFirst")
      .mockResolvedValueOnce({ id: 1, cpf: "12345678900" } as any);
    const isDuplicate = await sut.validate("12345678900");
    expect(isDuplicate).toBe(true);
  });

  test("Should throw if prisma throws", async () => {
    const { sut, prismaStub } = makeSut();
    jest
      .spyOn(prismaStub.client, "findFirst")
      .mockRejectedValueOnce(new Error());
    const promise = sut.validate("12345678900");
    await expect(promise).rejects.toThrow();
  });
});
