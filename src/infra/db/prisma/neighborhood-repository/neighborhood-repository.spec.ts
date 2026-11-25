import { NeighborhoodMysqlRepository } from "./neighborhood-repository";

const makeFakeNeighborhood = () => ({
  id: 1,
  name: "any_name",
  cityId: 1,
  city: { id: 1, name: "any_city" },
});

const makeFakePrisma = () => ({
  neighborhood: {
    findMany: jest.fn().mockResolvedValue([makeFakeNeighborhood()]),
    create: jest.fn().mockResolvedValue(makeFakeNeighborhood()),
    update: jest.fn().mockResolvedValue(makeFakeNeighborhood()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): {
  sut: NeighborhoodMysqlRepository;
  prisma: FakePrisma;
} => {
  const prisma = makeFakePrisma();
  const sut = new NeighborhoodMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("Neighborhood MySql Repository", () => {
  describe("loadAll()", () => {
    test("Should call prisma.neighborhood.findMany with correct params", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.neighborhood.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
        include: { city: true },
      });
    });

    test("Should return a list of neighborhoods on success", async () => {
      const { sut } = makeSut();
      const neighborhoods = await sut.loadAll();
      expect(neighborhoods).toEqual([makeFakeNeighborhood()]);
    });

    test("Should throw if prisma.neighborhood.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.neighborhood.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("add()", () => {
    const fakeAddNeighborhood = { name: "any_name", cityId: 1 };

    test("Should call prisma.neighborhood.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.add(fakeAddNeighborhood);
      expect(prisma.neighborhood.create).toHaveBeenCalledWith({
        data: { name: "any_name", cityId: 1 },
      });
    });

    test("Should return a neighborhood on success", async () => {
      const { sut } = makeSut();
      const neighborhood = await sut.add(fakeAddNeighborhood);
      expect(neighborhood).toEqual(makeFakeNeighborhood());
    });

    test("Should throw if prisma.neighborhood.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.neighborhood.create.mockRejectedValueOnce(new Error());
      await expect(sut.add(fakeAddNeighborhood)).rejects.toThrow();
    });
  });

  describe("update()", () => {
    test("Should call prisma.neighborhood.update with all fields when provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, { name: "new_name", cityId: 2 });
      expect(prisma.neighborhood.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "new_name", cityId: 2 },
        include: { city: true },
      });
    });

    test("Should call prisma.neighborhood.update with empty data when nothing provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, {});
      expect(prisma.neighborhood.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
        include: { city: true },
      });
    });

    test("Should return an updated neighborhood on success", async () => {
      const { sut } = makeSut();
      const neighborhood = await sut.update(1, { name: "new_name" });
      expect(neighborhood).toEqual(makeFakeNeighborhood());
    });

    test("Should throw if prisma.neighborhood.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.neighborhood.update.mockRejectedValueOnce(new Error());
      await expect(sut.update(1, { name: "new_name" })).rejects.toThrow();
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.neighborhood.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.neighborhood.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteOne(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.neighborhood.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.neighborhood.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteOne(1)).rejects.toThrow();
    });
  });
});
