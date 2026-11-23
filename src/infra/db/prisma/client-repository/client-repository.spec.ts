import { CpfInUseError } from "../../../../domain/errors";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ClientMysqlRepository } from "./client-repository";

const makeFakeClient = () => ({
  id: 1,
  name: "any_name",
  cpf: "12345678900",
  phone: "any_phone",
});

const makeFakePrisma = () => ({
  client: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(makeFakeClient()),
    findMany: jest.fn().mockResolvedValue([makeFakeClient()]),
    findUnique: jest.fn().mockResolvedValue(makeFakeClient()),
    update: jest.fn().mockResolvedValue(makeFakeClient()),
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

const makeSut = (): { sut: ClientMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new ClientMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("Client MySql Repository", () => {
  describe("add()", () => {
    const fakeAddClient = {
      name: "any_name",
      cpf: "123.456.789-00",
      phone: "any_phone",
    };

    test("Should call prisma.client.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.add(fakeAddClient);
      expect(prisma.client.create).toHaveBeenCalledWith({
        data: {
          name: "any_name",
          cpf: "12345678900",
          phone: "any_phone",
        },
      });
    });

    test("Should return a client on success", async () => {
      const { sut } = makeSut();
      const client = await sut.add(fakeAddClient);
      expect(client).toEqual(makeFakeClient());
    });

    test("Should throw if prisma.client.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.create.mockRejectedValueOnce(new Error());
      await expect(sut.add(fakeAddClient)).rejects.toThrow();
    });
  });

  describe("loadAll()", () => {
    test("Should call prisma.client.findMany with correct include", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.client.findMany).toHaveBeenCalledWith({
        include: {
          Register: {
            include: {
              address: true,
            },
          },
        },
      });
    });

    test("Should return a list of clients on success", async () => {
      const { sut } = makeSut();
      const clients = await sut.loadAll();
      expect(clients).toEqual([makeFakeClient()]);
    });

    test("Should throw if prisma.client.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("loadOne()", () => {
    test("Should call prisma.client.findUnique with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadOne(1);
      expect(prisma.client.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return a client on success", async () => {
      const { sut } = makeSut();
      const client = await sut.loadOne(1);
      expect(client).toEqual(makeFakeClient());
    });

    test("Should throw if prisma.client.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.loadOne(1)).rejects.toThrow();
    });
  });

  describe("update()", () => {
    const fakeUpdateClient = {
      name: "new_name",
      cpf: "12345678900",
      phone: "new_phone",
    };

    test("Should call prisma.client.update with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, fakeUpdateClient);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...fakeUpdateClient },
      });
    });

    test("Should ignore fields outside the whitelist and clean cpf", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, {
        id: 999,
        name: "new_name",
        cpf: "123.456.789-00",
        status: false,
      } as any);
      expect(prisma.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "new_name", status: false, cpf: "12345678900" },
      });
    });

    test("Should return an updated client on success", async () => {
      const { sut } = makeSut();
      const client = await sut.update(1, fakeUpdateClient);
      expect(client).toEqual(makeFakeClient());
    });

    test("Should throw if prisma.client.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.update.mockRejectedValueOnce(new Error());
      await expect(sut.update(1, fakeUpdateClient)).rejects.toThrow();
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.client.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.client.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteOne(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.client.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteOne(1)).rejects.toThrow();
    });

    test("Should throw NotFoundError if prisma.client.delete throws a known Prisma error", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.delete.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError("x", { code: "P2025", clientVersion: "6.7.0" }));
      await expect(sut.deleteOne(1)).rejects.toBeInstanceOf(NotFoundError);
    });

    test("Should rethrow unknown errors from prisma.client.delete as they are", async () => {
      const { sut, prisma } = makeSut();
      const error = new Error("db down");
      prisma.client.delete.mockRejectedValueOnce(error);
      await expect(sut.deleteOne(1)).rejects.toBe(error);
    });

    test("Should throw ResourceInUseError if prisma.client.delete fails on a foreign key", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.delete.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError("x", { code: "P2003", clientVersion: "6.7.0" }));
      await expect(sut.deleteOne(1)).rejects.toBeInstanceOf(ResourceInUseError);
    });
  });

  describe("unique constraint errors", () => {
    test("Should throw CpfInUseError if create fails on the cpf unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.create.mockRejectedValueOnce(makeUniqueError(["cpf"]));
      await expect(sut.add({ name: "any_name", cpf: "123", phone: "any_phone" })).rejects.toBeInstanceOf(CpfInUseError);
    });

    test("Should throw CpfInUseError if update fails on the cpf unique constraint", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.update.mockRejectedValueOnce(makeUniqueError(["cpf"]));
      await expect(sut.update(1, makeFakeClient())).rejects.toBeInstanceOf(CpfInUseError);
    });

    test("Should rethrow unique errors on other fields as they are", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.create.mockRejectedValueOnce(makeUniqueError(["other_field"]));
      await expect(sut.add({ name: "any_name", cpf: "123", phone: "any_phone" })).rejects.toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    });
  });

  describe("existsByCpf()", () => {
    test("Should call prisma.client.findFirst with the cleaned cpf", async () => {
      const { sut, prisma } = makeSut();
      await sut.existsByCpf("123.456.789-00");
      expect(prisma.client.findFirst).toHaveBeenCalledWith({ where: { cpf: "12345678900" } });
    });

    test("Should return false if no record is found", async () => {
      const { sut } = makeSut();
      expect(await sut.existsByCpf("123.456.789-00")).toBe(false);
    });

    test("Should return true if a record is found", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.findFirst.mockResolvedValueOnce({ id: 1 });
      expect(await sut.existsByCpf("123.456.789-00")).toBe(true);
    });

    test("Should throw if prisma.client.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.existsByCpf("123.456.789-00")).rejects.toThrow();
    });
  });
});
