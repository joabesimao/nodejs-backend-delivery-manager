import { VehicleMysqlRepository } from "./vehicle-repository";

const makeFakeVehicle = () => ({
  id: 1,
  plate: "ABC1D23",
  model: "any_model",
  brand: "any_brand",
  deliverymanId: 1,
});

const makeFakePrisma = () => ({
  vehicle: {
    findMany: jest.fn().mockResolvedValue([makeFakeVehicle()]),
    create: jest.fn().mockResolvedValue(makeFakeVehicle()),
    update: jest.fn().mockResolvedValue(makeFakeVehicle()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: VehicleMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new VehicleMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("Vehicle MySql Repository", () => {
  describe("loadAll()", () => {
    test("Should call prisma.vehicle.findMany with correct order", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        orderBy: { plate: "asc" },
      });
    });

    test("Should return a list of vehicles on success", async () => {
      const { sut } = makeSut();
      const vehicles = await sut.loadAll();
      expect(vehicles).toEqual([makeFakeVehicle()]);
    });

    test("Should throw if prisma.vehicle.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("add()", () => {
    test("Should call prisma.vehicle.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.add({
        plate: "ABC1D23",
        model: "any_model",
        brand: "any_brand",
        deliverymanId: 1,
      });
      expect(prisma.vehicle.create).toHaveBeenCalledWith({
        data: {
          plate: "ABC1D23",
          model: "any_model",
          brand: "any_brand",
          deliverymanId: 1,
        },
      });
    });

    test("Should return a vehicle on success", async () => {
      const { sut } = makeSut();
      const vehicle = await sut.add({ plate: "ABC1D23", model: "any_model" });
      expect(vehicle).toEqual(makeFakeVehicle());
    });

    test("Should throw if prisma.vehicle.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.create.mockRejectedValueOnce(new Error());
      await expect(sut.add({ plate: "ABC1D23", model: "any_model" })).rejects.toThrow();
    });
  });

  describe("update()", () => {
    test("Should call prisma.vehicle.update with correct values when fields are provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, { plate: "new_plate" });
      expect(prisma.vehicle.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { plate: "new_plate" },
      });
    });

    test("Should call prisma.vehicle.update without fields in data when not provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, {});
      expect(prisma.vehicle.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });

    test("Should return an updated vehicle on success", async () => {
      const { sut } = makeSut();
      const vehicle = await sut.update(1, { plate: "new_plate" });
      expect(vehicle).toEqual(makeFakeVehicle());
    });

    test("Should throw if prisma.vehicle.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.update.mockRejectedValueOnce(new Error());
      await expect(sut.update(1, { plate: "new_plate" })).rejects.toThrow();
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.vehicle.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.vehicle.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteOne(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.vehicle.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteOne(1)).rejects.toThrow();
    });
  });
});
