import { Prisma } from "@prisma/client";
import { PlateInUseError, VehicleInUseError } from "../../../../domain/errors";
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
    findFirst: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([makeFakeVehicle()]),
    create: jest.fn().mockResolvedValue(makeFakeVehicle()),
    update: jest.fn().mockResolvedValue(makeFakeVehicle()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeUniqueError = (target: string[]) =>
  new Prisma.PrismaClientKnownRequestError("x", {
    code: "P2002",
    clientVersion: "6.7.0",
    meta: { target },
  });

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

  describe("Prisma errors", () => {
    test("Should throw PlateInUseError if create fails on the plate unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.create.mockRejectedValueOnce(makeUniqueError(["plate"]));
      await expect(sut.add({ plate: "ABC1234", model: "any_model" })).rejects.toBeInstanceOf(PlateInUseError);
    });

    test("Should throw PlateInUseError if update fails on the plate unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.update.mockRejectedValueOnce(makeUniqueError(["plate"]));
      await expect(sut.update(1, { plate: "ABC1234" })).rejects.toBeInstanceOf(PlateInUseError);
    });

    test("Should rethrow unique errors on other fields as they are", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.create.mockRejectedValueOnce(makeUniqueError(["other_field"]));
      await expect(sut.add({ plate: "ABC1234", model: "any_model" })).rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    });

    test("Should throw VehicleInUseError if delete fails on a foreign key", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.delete.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError("x", { code: "P2003", clientVersion: "6.7.0" }));
      await expect(sut.deleteOne(1)).rejects.toBeInstanceOf(VehicleInUseError);
    });

    test("Should rethrow other known errors from delete as they are", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.delete.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError("x", { code: "P2025", clientVersion: "6.7.0" }));
      await expect(sut.deleteOne(1)).rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe("existsByPlate()", () => {
    test("Should call prisma.vehicle.findFirst with the plate", async () => {
      const { sut, prisma } = makeSut();
      await sut.existsByPlate("ABC1D23");
      expect(prisma.vehicle.findFirst).toHaveBeenCalledWith({ where: { plate: "ABC1D23" } });
    });

    test("Should return false if no record is found", async () => {
      const { sut } = makeSut();
      expect(await sut.existsByPlate("ABC1D23")).toBe(false);
    });

    test("Should return true if a record is found", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.findFirst.mockResolvedValueOnce({ id: 1 });
      expect(await sut.existsByPlate("ABC1D23")).toBe(true);
    });

    test("Should throw if prisma.vehicle.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.vehicle.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.existsByPlate("ABC1D23")).rejects.toThrow();
    });
  });
});
