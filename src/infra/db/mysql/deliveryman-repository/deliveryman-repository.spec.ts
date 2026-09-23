import { DeliverymanMysqlRepository } from "./deliveryman-repository";

const makeFakeDeliveryman = () => ({
  id: 1,
  name: "any_name",
  lastName: "any_last_name",
  numberQualification: "any_qualification",
  phone: "any_phone",
});

const makeFakePrisma = () => ({
  deliveryman: {
    findMany: jest.fn().mockResolvedValue([makeFakeDeliveryman()]),
    findUnique: jest.fn().mockResolvedValue(makeFakeDeliveryman()),
    create: jest.fn().mockResolvedValue(makeFakeDeliveryman()),
    update: jest.fn().mockResolvedValue(makeFakeDeliveryman()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: DeliverymanMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new DeliverymanMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("Deliveryman MySql Repository", () => {
  describe("loadAll()", () => {
    test("Should call prisma.deliveryman.findMany with correct order", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.deliveryman.findMany).toHaveBeenCalledWith({
        orderBy: [{ name: "asc" }, { lastName: "asc" }],
      });
    });

    test("Should return a list of deliverymen on success", async () => {
      const { sut } = makeSut();
      const deliverymen = await sut.loadAll();
      expect(deliverymen).toEqual([makeFakeDeliveryman()]);
    });

    test("Should throw if prisma.deliveryman.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("loadOne()", () => {
    test("Should call prisma.deliveryman.findUnique with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadOne(1);
      expect(prisma.deliveryman.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return a deliveryman on success", async () => {
      const { sut } = makeSut();
      const deliveryman = await sut.loadOne(1);
      expect(deliveryman).toEqual(makeFakeDeliveryman());
    });

    test("Should throw if prisma.deliveryman.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.loadOne(1)).rejects.toThrow();
    });
  });

  describe("add()", () => {
    const fakeAddDeliveryman = {
      name: "any_name",
      lastName: "any_last_name",
      numberQualification: "any_qualification",
      phone: "any_phone",
      cpf: "any_cpf",
    };

    test("Should call prisma.deliveryman.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.add(fakeAddDeliveryman);
      expect(prisma.deliveryman.create).toHaveBeenCalledWith({
        data: fakeAddDeliveryman,
      });
    });

    test("Should return a deliveryman on success", async () => {
      const { sut } = makeSut();
      const deliveryman = await sut.add(fakeAddDeliveryman);
      expect(deliveryman).toEqual(makeFakeDeliveryman());
    });

    test("Should throw if prisma.deliveryman.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.create.mockRejectedValueOnce(new Error());
      await expect(sut.add(fakeAddDeliveryman)).rejects.toThrow();
    });
  });

  describe("update()", () => {
    test("Should call prisma.deliveryman.update with all fields when all are provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, {
        name: "new_name",
        lastName: "new_last_name",
        phone: "new_phone",
        numberQualification: "new_qualification",
      });
      expect(prisma.deliveryman.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "new_name",
          lastName: "new_last_name",
          phone: "new_phone",
          numberQualification: "new_qualification",
        },
      });
    });

    test("Should call prisma.deliveryman.update with empty data when nothing is provided", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, {});
      expect(prisma.deliveryman.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });

    test("Should return an updated deliveryman on success", async () => {
      const { sut } = makeSut();
      const deliveryman = await sut.update(1, { name: "new_name" });
      expect(deliveryman).toEqual(makeFakeDeliveryman());
    });

    test("Should throw if prisma.deliveryman.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.update.mockRejectedValueOnce(new Error());
      await expect(sut.update(1, { name: "new_name" })).rejects.toThrow();
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.deliveryman.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.deliveryman.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteOne(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.deliveryman.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteOne(1)).rejects.toThrow();
    });
  });
});
