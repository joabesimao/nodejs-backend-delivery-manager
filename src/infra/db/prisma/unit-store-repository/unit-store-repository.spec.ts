import { UnitStoreMysqlRepository } from "./unit-store-repository";

const makeFakeUnits = () => [
  { id: 2, name: "Matriz", parentStoreId: null, isMain: true },
  { id: 5, name: "Filial", parentStoreId: 2, isMain: false },
];

const makeSut = () => {
  const prisma = { unitStore: { findMany: jest.fn().mockResolvedValue(makeFakeUnits()) } };
  const sut = new UnitStoreMysqlRepository(prisma as never);
  return { sut, prisma };
};

describe("UnitStore MySql Repository", () => {
  test("loadByIds() returns the unit summaries ordered by id", async () => {
    const { sut, prisma } = makeSut();
    const units = await sut.loadByIds([5, 2]);
    expect(prisma.unitStore.findMany).toHaveBeenCalledWith({
      where: { id: { in: [5, 2] } },
      select: { id: true, name: true, parentStoreId: true, isMain: true },
      orderBy: { id: "asc" },
    });
    expect(units).toEqual(makeFakeUnits());
  });

  test("loadByIds() throws when prisma throws", async () => {
    const { sut, prisma } = makeSut();
    prisma.unitStore.findMany.mockRejectedValueOnce(new Error("db error"));
    await expect(sut.loadByIds([1])).rejects.toThrow("db error");
  });
});
