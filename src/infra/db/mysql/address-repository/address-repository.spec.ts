import { AddressMysqlRepository } from "./address-repository";

const makeFakeAddress = () => ({
  id: 1,
  street: "any_street",
  neighborhood: "any_neighborhood",
  city: "any_city",
  numberHouse: 123,
  reference: "any_reference",
});

const makeFakePrisma = () => ({
  address: {
    create: jest.fn().mockResolvedValue(makeFakeAddress()),
    findMany: jest.fn().mockResolvedValue([makeFakeAddress()]),
    update: jest.fn().mockResolvedValue(makeFakeAddress()),
    delete: jest.fn().mockResolvedValue({}),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: AddressMysqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new AddressMysqlRepository(prisma as any);
  return { sut, prisma };
};

describe("Address MySql Repository", () => {
  describe("add()", () => {
    const fakeAddAddress = {
      street: "any_street",
      neighborhood: "any_neighborhood",
      city: "any_city",
      numberHouse: 123,
      reference: "any_reference",
    };

    test("Should call prisma.address.create with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.add(fakeAddAddress);
      expect(prisma.address.create).toHaveBeenCalledWith({
        data: fakeAddAddress,
      });
    });

    test("Should return an address on success", async () => {
      const { sut } = makeSut();
      const address = await sut.add(fakeAddAddress);
      expect(address).toEqual(makeFakeAddress());
    });

    test("Should throw if prisma.address.create throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.address.create.mockRejectedValueOnce(new Error());
      await expect(sut.add(fakeAddAddress)).rejects.toThrow();
    });
  });

  describe("loadAll()", () => {
    test("Should call prisma.address.findMany", async () => {
      const { sut, prisma } = makeSut();
      await sut.loadAll();
      expect(prisma.address.findMany).toHaveBeenCalledWith();
    });

    test("Should return a list of addresses on success", async () => {
      const { sut } = makeSut();
      const addresses = await sut.loadAll();
      expect(addresses).toEqual([makeFakeAddress()]);
    });

    test("Should throw if prisma.address.findMany throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.address.findMany.mockRejectedValueOnce(new Error());
      await expect(sut.loadAll()).rejects.toThrow();
    });
  });

  describe("update()", () => {
    const fakeUpdateAddress = {
      street: "new_street",
      neighborhood: "new_neighborhood",
      city: "new_city",
      numberHouse: 456,
      reference: "new_reference",
    };

    test("Should call prisma.address.update with correct values", async () => {
      const { sut, prisma } = makeSut();
      await sut.update(1, fakeUpdateAddress);
      expect(prisma.address.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { ...fakeUpdateAddress },
      });
    });

    test("Should return an updated address on success", async () => {
      const { sut } = makeSut();
      const address = await sut.update(1, fakeUpdateAddress);
      expect(address).toEqual(makeFakeAddress());
    });

    test("Should throw if prisma.address.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.address.update.mockRejectedValueOnce(new Error());
      await expect(sut.update(1, fakeUpdateAddress)).rejects.toThrow();
    });
  });

  describe("deleteOne()", () => {
    test("Should call prisma.address.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      await sut.deleteOne(1);
      expect(prisma.address.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return success message", async () => {
      const { sut } = makeSut();
      const message = await sut.deleteOne(1);
      expect(message).toBe("Deletado com sucesso!");
    });

    test("Should throw if prisma.address.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.address.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteOne(1)).rejects.toThrow();
    });
  });
});
