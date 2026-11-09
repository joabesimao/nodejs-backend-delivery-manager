import { Prisma } from "@prisma/client";
import { CpfInUseError, QualificationInUseError } from "../../../../domain/errors";
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
    findFirst: jest.fn().mockResolvedValue(null),
    findMany: jest.fn().mockResolvedValue([makeFakeDeliveryman()]),
    findUnique: jest.fn().mockResolvedValue(makeFakeDeliveryman()),
    create: jest.fn().mockResolvedValue(makeFakeDeliveryman()),
    update: jest.fn().mockResolvedValue(makeFakeDeliveryman()),
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

const makeFakeAddDeliveryman = () => ({
  name: "any_name",
  lastName: "any_last_name",
  numberQualification: "any_qualification",
  phone: "any_phone",
  cpf: "12345678900",
});

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
      cpf: "123.456.789-01",
    };

    test("Should call prisma.deliveryman.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.add(fakeAddDeliveryman);
      expect(prisma.deliveryman.create).toHaveBeenCalledWith({
        data: { ...fakeAddDeliveryman, cpf: "12345678901" },
      });
    });

    test("Should store a null cpf when it is empty", async () => {
      const { sut, prisma } = makeSut();
      await sut.add({ ...fakeAddDeliveryman, cpf: "" });
      expect(prisma.deliveryman.create).toHaveBeenCalledWith({
        data: { ...fakeAddDeliveryman, cpf: null },
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

    test("Should normalize the cpf on update", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, { cpf: "123.456.789-01" });
      expect(prisma.deliveryman.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { cpf: "12345678901" },
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

  describe("unique constraint errors", () => {
    test("Should throw CpfInUseError if create fails on the cpf unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.create.mockRejectedValueOnce(makeUniqueError(["cpf"]));
      await expect(sut.add(makeFakeAddDeliveryman())).rejects.toBeInstanceOf(CpfInUseError);
    });

    test("Should throw CpfInUseError if update fails on the cpf unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.update.mockRejectedValueOnce(makeUniqueError(["cpf"]));
      await expect(sut.update(1, { cpf: "123" })).rejects.toBeInstanceOf(CpfInUseError);
    });

    test("Should throw QualificationInUseError if create fails on the numberQualification unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.create.mockRejectedValueOnce(makeUniqueError(["numberQualification"]));
      await expect(sut.add(makeFakeAddDeliveryman())).rejects.toBeInstanceOf(QualificationInUseError);
    });

    test("Should throw QualificationInUseError if update fails on the numberQualification unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.update.mockRejectedValueOnce(makeUniqueError(["numberQualification"]));
      await expect(sut.update(1, { numberQualification: "1" })).rejects.toBeInstanceOf(QualificationInUseError);
    });

    test("Should rethrow unique errors on other fields as they are", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.create.mockRejectedValueOnce(makeUniqueError(["other_field"]));
      await expect(sut.add(makeFakeAddDeliveryman())).rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe("existsByCpf()", () => {
    test("Should call prisma.deliveryman.findFirst with the cleaned cpf", async () => {
      const { sut, prisma } = makeSut();
      await sut.existsByCpf("123.456.789-00");
      expect(prisma.deliveryman.findFirst).toHaveBeenCalledWith({ where: { cpf: "12345678900" } });
    });

    test("Should return false if no record is found", async () => {
      const { sut } = makeSut();
      expect(await sut.existsByCpf("123.456.789-00")).toBe(false);
    });

    test("Should return true if a record is found", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findFirst.mockResolvedValueOnce({ id: 1 });
      expect(await sut.existsByCpf("123.456.789-00")).toBe(true);
    });

    test("Should throw if prisma.deliveryman.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.existsByCpf("123.456.789-00")).rejects.toThrow();
    });
  });

  describe("existsByNumberQualification()", () => {
    test("Should call prisma.deliveryman.findFirst with the number qualification", async () => {
      const { sut, prisma } = makeSut();
      await sut.existsByNumberQualification("any_qualification");
      expect(prisma.deliveryman.findFirst).toHaveBeenCalledWith({ where: { numberQualification: "any_qualification" } });
    });

    test("Should return false if no record is found", async () => {
      const { sut } = makeSut();
      expect(await sut.existsByNumberQualification("any_qualification")).toBe(false);
    });

    test("Should return true if a record is found", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findFirst.mockResolvedValueOnce({ id: 1 });
      expect(await sut.existsByNumberQualification("any_qualification")).toBe(true);
    });

    test("Should throw if prisma.deliveryman.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.deliveryman.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.existsByNumberQualification("any_qualification")).rejects.toThrow();
    });
  });
});
