import { FuelRefillMysqlRepository } from "./fuel-refill-repository";

const fixedDate = new Date();

const makeFakeRefill = () => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  previousKm: 600,
  kmDriven: 400,
  liters: 20,
  totalValue: 150,
  refillDate: fixedDate,
  createdAt: fixedDate,
});

const makeFakePrisma = () => ({
  fuelRefill: {
    create: jest.fn().mockResolvedValue(makeFakeRefill()),
    findFirst: jest.fn().mockResolvedValue(makeFakeRefill()),
    findMany: jest.fn().mockResolvedValue([makeFakeRefill()]),
  },
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
        totalValue: 150,
        refillDate: new Date(),
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
          totalValue: 150,
          refillDate: new Date(),
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
        orderBy: { refillDate: "desc" },
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
        orderBy: { refillDate: "desc" },
      });
    });

    test("Should call prisma.fuelRefill.findMany filtering by vehicleId and deliverymanId", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll({ vehicleId: 1, deliverymanId: 2 });
      expect(prisma.fuelRefill.findMany).toHaveBeenCalledWith({
        where: { vehicleId: 1, deliverymanId: 2 },
        include: { vehicle: true, deliveryman: true },
        orderBy: { refillDate: "desc" },
      });
    });

    test("Should throw if prisma.fuelRefill.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.fuelRefill.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });
});
