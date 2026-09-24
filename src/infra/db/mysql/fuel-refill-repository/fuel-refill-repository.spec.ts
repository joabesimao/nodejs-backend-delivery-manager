import { FuelRefillMysqlRepository } from "./fuel-refill-repository";

const fixedDate = new Date("2026-09-23T00:00:00.000Z");

const makeFakeRefill = () => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  previousKm: 600,
  kmDriven: 400,
  liters: 20,
  pricePerLiter: 7.5,
  totalValue: 150,
  refillDate: fixedDate,
  createdAt: fixedDate,
});

const makeFakePrisma = () => ({
  fuelRefill: {
    create: jest.fn().mockResolvedValue(makeFakeRefill()),
    findFirst: jest.fn().mockResolvedValue(makeFakeRefill()),
    findMany: jest.fn().mockResolvedValue([makeFakeRefill()]),
    findUnique: jest.fn().mockResolvedValue(makeFakeRefill()),
    update: jest.fn().mockResolvedValue(makeFakeRefill()),
    delete: jest.fn().mockResolvedValue(makeFakeRefill()),
  },
  $transaction: jest.fn().mockResolvedValue([]),
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: FuelRefillMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new FuelRefillMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("FuelRefill MySql Repository", () => {
  describe("add()", () => {
    test("Should call prisma.fuelRefill.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      const data = {
        vehicleId: 1,
        deliverymanId: 1,
        km: 1000,
        previousKm: 600,
        kmDriven: 400,
        liters: 20,
        pricePerLiter: 7.5,
        totalValue: 150,
        refillDate: new Date("2026-09-23T00:00:00.000Z"),
      };
      await sut.add(data);
      expect(prisma.fuelRefill.create).toHaveBeenCalledWith({
        data,
        include: { vehicle: true, deliveryman: true },
      });
    });

    test("Should throw if prisma.fuelRefill.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.create.mockRejectedValueOnce(new Error());
      await expect(
        sut.add({
          vehicleId: 1,
          deliverymanId: 1,
          km: 1000,
          liters: 20,
          pricePerLiter: 7.5,
          totalValue: 150,
          refillDate: new Date("2026-09-23T00:00:00.000Z"),
        })
      ).rejects.toThrow();
    });
  });

  describe("findLastByVehicle()", () => {
    test("Should call prisma.fuelRefill.findFirst with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.findLastByVehicle(1);
      expect(prisma.fuelRefill.findFirst).toHaveBeenCalledWith({
        where: { vehicleId: 1 },
        orderBy: [{ refillDate: "desc" }, { id: "desc" }],
      });
    });

    test("Should throw if prisma.fuelRefill.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.findLastByVehicle(1)).rejects.toThrow();
    });
  });

  describe("loadAll()", () => {
    test("Should call prisma.fuelRefill.findMany with empty filters when no params", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.fuelRefill.findMany).toHaveBeenCalledWith({
        where: {},
        include: { vehicle: true, deliveryman: true },
        orderBy: [{ refillDate: "desc" }, { id: "desc" }],
      });
    });

    test("Should call prisma.fuelRefill.findMany filtering by vehicleId and deliverymanId", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll({ vehicleId: 1, deliverymanId: 2 });
      expect(prisma.fuelRefill.findMany).toHaveBeenCalledWith({
        where: { vehicleId: 1, deliverymanId: 2 },
        include: { vehicle: true, deliveryman: true },
        orderBy: [{ refillDate: "desc" }, { id: "desc" }],
      });
    });

    test("Should throw if prisma.fuelRefill.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("findById()", () => {
    test("Should return the refill with numeric decimals", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findUnique.mockResolvedValueOnce({
        ...makeFakeRefill(),
        liters: { toString: () => "20.00" },
        pricePerLiter: { toString: () => "7.499" },
      });
      const refill = await sut.findById(1);
      expect(prisma.fuelRefill.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { vehicle: true, deliveryman: true },
      });
      expect(refill.liters).toBe(20);
      expect(refill.pricePerLiter).toBe(7.499);
    });

    test("Should return null if refill does not exist", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findUnique.mockResolvedValueOnce(null);
      expect(await sut.findById(99)).toBeNull();
    });
  });

  describe("update()", () => {
    test("Should only send provided fields to prisma.fuelRefill.update", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, { km: 1200, pricePerLiter: 6.5 });
      expect(prisma.fuelRefill.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { km: 1200, pricePerLiter: 6.5 },
      });
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.fuelRefill.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.fuelRefill.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("recalculateKmChain()", () => {
    test("Should update previousKm/kmDriven only for refills that changed", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findMany.mockResolvedValueOnce([
        { id: 1, km: 1000, previousKm: null, kmDriven: null },
        { id: 3, km: 1300, previousKm: 1200, kmDriven: 100 },
        { id: 4, km: 1500, previousKm: 1300, kmDriven: 200 },
      ]);
      await sut.recalculateKmChain(1);
      expect(prisma.fuelRefill.findMany).toHaveBeenCalledWith({
        where: { vehicleId: 1 },
        orderBy: [{ refillDate: "asc" }, { id: "asc" }],
        select: { id: true, km: true, previousKm: true, kmDriven: true },
      });
      expect(prisma.fuelRefill.update).toHaveBeenCalledTimes(1);
      expect(prisma.fuelRefill.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: { previousKm: 1000, kmDriven: 300 },
      });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    test("Should not open a transaction when nothing changed", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findMany.mockResolvedValueOnce([{ id: 1, km: 1000, previousKm: null, kmDriven: null }]);
      await sut.recalculateKmChain(1);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });
});
