import { CityMysqlRepository } from "./city-repository";

const makeFakeCity = () => ({ id: 1, name: "any_name" });

const makeFakePrisma = () => ({
  city: {
    findMany: jest.fn().mockResolvedValue([makeFakeCity()]),
    create: jest.fn().mockResolvedValue(makeFakeCity()),
    update: jest.fn().mockResolvedValue(makeFakeCity()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: CityMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new CityMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("City MySql Repository", () => {
  describe("loadAll()", () => {
    test("Should call prisma.city.findMany with correct order", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.city.findMany).toHaveBeenCalledWith({
        orderBy: { name: "asc" },
      });
    });

    test("Should return a list of cities on success", async () => {
      const { sut } = makeSut();
      const cities = await sut.loadAll();
      expect(cities).toEqual([makeFakeCity()]);
    });

    test("Should throw if prisma.city.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.city.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("add()", () => {
    test("Should call prisma.city.create with correct name", async () => {
      const { sut, prisma } = makeSut();
      await sut.add({ name: "any_name" });
      expect(prisma.city.create).toHaveBeenCalledWith({
        data: { name: "any_name" },
      });
    });

    test("Should return a city on success", async () => {
      const { sut } = makeSut();
      const city = await sut.add({ name: "any_name" });
      expect(city).toEqual(makeFakeCity());
    });

    test("Should throw if prisma.city.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.city.create.mockRejectedValueOnce(new Error());
      await expect(sut.add({ name: "any_name" })).rejects.toThrow();
    });
  });

  describe("update()", () => {
    test("Should call prisma.city.update with correct values when name is provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, { name: "new_name" });
      expect(prisma.city.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "new_name" },
      });
    });

    test("Should call prisma.city.update without name in data when name is not provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, {});
      expect(prisma.city.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });

    test("Should return an updated city on success", async () => {
      const { sut } = makeSut();
      const city = await sut.update(1, { name: "new_name" });
      expect(city).toEqual(makeFakeCity());
    });

    test("Should throw if prisma.city.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.city.update.mockRejectedValueOnce(new Error());
      await expect(sut.update(1, { name: "new_name" })).rejects.toThrow();
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.city.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.city.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteOne(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.city.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.city.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteOne(1)).rejects.toThrow();
    });
  });
});
