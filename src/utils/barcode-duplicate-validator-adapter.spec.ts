import { PrismaClient } from "@prisma/client";
import { BarcodeDuplicateValidatorAdapter } from "./barcode-duplicate-validator-adapter";

const makePrismaStub = (): PrismaClient => {
  return {
    product: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
  } as unknown as PrismaClient;
};

interface SutTypes {
  sut: BarcodeDuplicateValidatorAdapter;
  prismaStub: PrismaClient;
}

const makeSut = (): SutTypes => {
  const prismaStub = makePrismaStub();
  const sut = new BarcodeDuplicateValidatorAdapter(prismaStub);
  return { sut, prismaStub };
};

describe("BarcodeDuplicateValidator Adapter", () => {
  test("Should call prisma.product.findFirst with the correct barcode", async () => {
    const { sut, prismaStub } = makeSut();
    const findFirstSpy = jest.spyOn(prismaStub.product, "findFirst");
    await sut.validate("789123");
    expect(findFirstSpy).toHaveBeenCalledWith({
      where: { barcode: "789123" },
    });
  });

  test("Should return false if no product is found", async () => {
    const { sut } = makeSut();
    const isDuplicate = await sut.validate("789123");
    expect(isDuplicate).toBe(false);
  });

  test("Should return true if a product is found", async () => {
    const { sut, prismaStub } = makeSut();
    jest
      .spyOn(prismaStub.product, "findFirst")
      .mockResolvedValueOnce({ id: 1, barcode: "789123" } as any);
    const isDuplicate = await sut.validate("789123");
    expect(isDuplicate).toBe(true);
  });

  test("Should throw if prisma throws", async () => {
    const { sut, prismaStub } = makeSut();
    jest
      .spyOn(prismaStub.product, "findFirst")
      .mockRejectedValueOnce(new Error());
    const promise = sut.validate("789123");
    await expect(promise).rejects.toThrow();
  });
});
