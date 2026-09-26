import { RegisterMySqlRepository } from "./register-mysql-repository";

const makeFakeRegister = () => ({
  id: 1,
  client: { id: 1, name: "any_name", cpf: "any_cpf", phone: "any_phone" },
  address: {
    id: 1,
    street: "any_street",
    neighborhood: "any_neighborhood",
    city: "any_city",
    numberHouse: 123,
    reference: "any_reference",
  },
});

const makeFakePrisma = () => ({
  register: {
    create: jest.fn().mockResolvedValue(makeFakeRegister()),
    findUnique: jest.fn().mockResolvedValue(makeFakeRegister()),
    findFirst: jest.fn().mockResolvedValue(makeFakeRegister()),
    update: jest.fn().mockResolvedValue(makeFakeRegister()),
    delete: jest.fn().mockResolvedValue({ id: 1, clientId: 2, addressId: 3 }),
    findMany: jest.fn().mockResolvedValue([makeFakeRegister()]),
  },
  client: {
    delete: jest.fn().mockResolvedValue({}),
  },
  address: {
    delete: jest.fn().mockResolvedValue({}),
  },
  $transaction: jest.fn(),
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: RegisterMySqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  prisma.$transaction.mockImplementation((work) => work(prisma));
  const sut = new RegisterMySqlRepository(prisma as any);
  return { sut, prisma };
};

const makeFakeAddRegister = () => ({
  client: { name: "any_name", cpf: "any_cpf", phone: "any_phone" },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    city: "any_city",
    numberHouse: 123,
    reference: "any_reference",
  },
});

describe("Register MySql Repository", () => {
  describe("add()", () => {
    test("Should call prisma.register.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      const fakeRegister = makeFakeAddRegister();
      await sut.add(fakeRegister);
      expect(prisma.register.create).toHaveBeenCalledWith({
        data: {
          client: {
            create: {
              name: fakeRegister.client.name,
              cpf: fakeRegister.client.cpf,
              phone: fakeRegister.client.phone,
            },
          },
          address: {
            create: {
              street: fakeRegister.address.street,
              city: fakeRegister.address.city,
              neighborhood: fakeRegister.address.neighborhood,
              numberHouse: Number(fakeRegister.address.numberHouse),
              reference: fakeRegister.address.reference,
            },
          },
        },
      });
    });

    test("Should return a register on success", async () => {
      const { sut } = makeSut();
      const register = await sut.add(makeFakeAddRegister());
      expect(register).toEqual(makeFakeRegister());
    });

    test("Should throw if prisma.register.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.create.mockRejectedValueOnce(new Error());
      await expect(sut.add(makeFakeAddRegister())).rejects.toThrow();
    });
  });

  describe("loadById()", () => {
    test("Should call prisma.register.findUnique with correct params", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadById(1);
      expect(prisma.register.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { client: true, address: true },
      });
    });

    test("Should return a register on success", async () => {
      const { sut } = makeSut();
      const register = await sut.loadById(1);
      expect(register).toEqual(makeFakeRegister());
    });

    test("Should throw if prisma.register.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.loadById(1)).rejects.toThrow();
    });
  });

  describe("findByName()", () => {
    test("Should call prisma.register.findFirst with correct name and include", async () => {
      const { sut, prisma } = makeSut();
      await sut.findByName("any_name");
      expect(prisma.register.findFirst).toHaveBeenCalledWith({
        where: { client: { name: "any_name" } },
        include: { client: true, address: true },
      });
    });

    test("Should return a register on success", async () => {
      const { sut } = makeSut();
      const register = await sut.findByName("any_name");
      expect(register).toEqual(makeFakeRegister());
    });

    test("Should return null if no register is found", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.findFirst.mockResolvedValueOnce(null);
      const register = await sut.findByName("any_name");
      expect(register).toBeNull();
    });

    test("Should throw if prisma.register.findFirst throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.findFirst.mockRejectedValueOnce(new Error());
      await expect(sut.findByName("any_name")).rejects.toThrow();
    });
  });

  describe("updateOneRegisterById()", () => {
    const fakeInfo = {
      client: { name: "new_name", cpf: "98765432100", phone: "new_phone" },
      address: {
        street: "new_street",
        neighborhood: "new_neighborhood",
        city: "new_city",
        numberHouse: 456,
        reference: "new_reference",
      },
    };

    test("Should call prisma.register.update with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateOneRegisterById(1, fakeInfo as any);
      expect(prisma.register.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          client: {
            update: {
              data: { name: "new_name", cpf: "98765432100", phone: "new_phone" },
            },
          },
          address: {
            update: {
              data: {
                street: fakeInfo.address.street,
                neighborhood: fakeInfo.address.neighborhood,
                city: fakeInfo.address.city,
                numberHouse: Number(fakeInfo.address.numberHouse),
                reference: fakeInfo.address.reference,
              },
            },
          },
        },
      });
    });

    test("Should ignore client and address fields outside the whitelist", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateOneRegisterById(1, {
        client: { id: 999, name: "new_name", cpf: "123.456.789-00" },
        address: { id: 999, numberHouse: "10" },
      } as any);
      expect(prisma.register.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          client: { update: { data: { name: "new_name", cpf: "12345678900" } } },
          address: { update: { data: { numberHouse: 10 } } },
        },
      });
    });

    test("Should return an updated register on success", async () => {
      const { sut } = makeSut();
      const register = await sut.updateOneRegisterById(1, fakeInfo as any);
      expect(register).toEqual(makeFakeRegister());
    });

    test("Should throw if prisma.register.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.update.mockRejectedValueOnce(new Error());
      await expect(
        sut.updateOneRegisterById(1, fakeInfo as any),
      ).rejects.toThrow();
    });
  });

  describe("deleteById()", () => {
    test("Should call prisma.register.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteById(1);
      expect(prisma.register.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should delete the register, its client and its address in one transaction", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteById(1);
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.client.delete).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(prisma.address.delete).toHaveBeenCalledWith({ where: { id: 3 } });
    });

    test("Should not delete client or address if register delete fails", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteById(1)).rejects.toThrow();
      expect(prisma.client.delete).not.toHaveBeenCalled();
      expect(prisma.address.delete).not.toHaveBeenCalled();
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteById(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.register.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteById(1)).rejects.toThrow();
    });
  });

  describe("loadAll()", () => {
    test("Should call prisma.register.findMany with correct include", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.register.findMany).toHaveBeenCalledWith({
        include: { client: true, address: true },
      });
    });

    test("Should return a list of registers on success", async () => {
      const { sut } = makeSut();
      const registers = await sut.loadAll();
      expect(registers).toEqual([makeFakeRegister()]);
    });

    test("Should throw if prisma.register.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.register.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });
});
