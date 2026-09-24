import { OilChangeMysqlRepository } from "./oil-change-repository";

const fixedDate = new Date();

const makeFakeConfig = () => ({ id: 1, intervalKm: 800, updatedAt: fixedDate });

const makeFakeLog = () => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  nextChangeKm: 1800,
  changeDate: fixedDate,
  createdAt: fixedDate,
});

const makeFakePrisma = () => ({
  oilChangeConfig: {
    findUnique: jest.fn().mockResolvedValue(makeFakeConfig()),
    create: jest.fn().mockResolvedValue(makeFakeConfig()),
    upsert: jest.fn().mockResolvedValue(makeFakeConfig()),
  },
  oilChangeLog: {
    create: jest.fn().mockResolvedValue(makeFakeLog()),
    findFirst: jest.fn().mockResolvedValue(makeFakeLog()),
    findMany: jest.fn().mockResolvedValue([makeFakeLog()]),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: OilChangeMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new OilChangeMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("OilChange MySql Repository", () => {
  describe("load()", () => {
    test("Should return existing config if found", async () => {
      const { sut, prisma } = makeSut();
      const config = await sut.load();
      expect(prisma.oilChangeConfig.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.oilChangeConfig.create).not.toHaveBeenCalled();
      expect(config).toEqual(makeFakeConfig());
    });

    test("Should create a default config if none exists", async () => {
      const { sut, prisma } = makeSut();
      prisma.oilChangeConfig.findUnique.mockResolvedValueOnce(null);
      await sut.load();
      expect(prisma.oilChangeConfig.create).toHaveBeenCalledWith({
        data: { id: 1, intervalKm: 800 },
      });
    });

    test("Should throw if prisma.oilChangeConfig.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.oilChangeConfig.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.load()).rejects.toThrow();
    });
  });

  describe("upsert()", () => {
    test("Should call prisma.oilChangeConfig.upsert with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.upsert(1000);
      expect(prisma.oilChangeConfig.upsert).toHaveBeenCalledWith({
        where: { id: 1 },
        update: { intervalKm: 1000 },
        create: { id: 1, intervalKm: 1000 },
      });
    });

    test("Should throw if prisma.oilChangeConfig.upsert throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.oilChangeConfig.upsert.mockRejectedValueOnce(new Error());
      await expect(sut.upsert(1000)).rejects.toThrow();
    });
  });

  describe("add()", () => {
    test("Should call prisma.oilChangeLog.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      const data = { vehicleId: 1, deliverymanId: 1, km: 1000, nextChangeKm: 1800, changeDate: new Date() };
      await sut.add(data);
      expect(prisma.oilChangeLog.create).toHaveBeenCalledWith({
        data,
        include: { vehicle: true, deliveryman: true },
      });
    });

    test("Should throw if prisma.oilChangeLog.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.oilChangeLog.create.mockRejectedValueOnce(new Error());
      await expect(
        sut.add({ vehicleId: 1, deliverymanId: 1, km: 1000, nextChangeKm: 1800, changeDate: new Date() })
      ).rejects.toThrow();
    });
  });

  describe("findLastByVehicle()", () => {
    test("Should call prisma.oilChangeLog.findFirst with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.findLastByVehicle(1);
      expect(prisma.oilChangeLog.findFirst).toHaveBeenCalledWith({
        where: { vehicleId: 1 },
        orderBy: { changeDate: "desc" },
      });
    });

    test("Should throw if prisma.oilChangeLog.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.oilChangeLog.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.findLastByVehicle(1)).rejects.toThrow();
    });
  });

  describe("loadAll()", () => {
    test("Should call prisma.oilChangeLog.findMany with empty filters when no params", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.oilChangeLog.findMany).toHaveBeenCalledWith({
        where: {},
        include: { vehicle: true, deliveryman: true },
        orderBy: { changeDate: "desc" },
      });
    });

    test("Should call prisma.oilChangeLog.findMany filtering by vehicleId and deliverymanId", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll({ vehicleId: 1, deliverymanId: 2 });
      expect(prisma.oilChangeLog.findMany).toHaveBeenCalledWith({
        where: { vehicleId: 1, deliverymanId: 2 },
        include: { vehicle: true, deliveryman: true },
        orderBy: { changeDate: "desc" },
      });
    });

    test("Should throw if prisma.oilChangeLog.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.oilChangeLog.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });
});
