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

    test("Should call prisma.client.findFirst with cleaned cpf", async () => {
      const { sut, prisma } = makeSut();
      await sut.add(fakeAddClient);
      expect(prisma.client.findFirst).toHaveBeenCalledWith({
        where: { cpf: "12345678900" },
      });
    });

    test("Should throw if cpf already exists", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.findFirst.mockResolvedValueOnce(makeFakeClient());
      await expect(sut.add(fakeAddClient)).rejects.toThrow(
        `CPF ${fakeAddClient.cpf} já cadastrado no sistema.`,
      );
    });

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

    test("Should throw if prisma.client.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.client.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.add(fakeAddClient)).rejects.toThrow();
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
  });
});
