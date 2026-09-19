import { AccountMySqlRepository } from "./account-repository";

const makeFakePrisma = () => ({
  account: {
    findUnique: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: AccountMySqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new AccountMySqlRepository(prisma as any);
  return { sut, prisma };
};

describe("Account MySql Repository", () => {
  describe("loadByToken()", () => {
    test("Should call prisma.account.findUnique with correct id", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.findUnique.mockResolvedValueOnce({
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        role: "admin",
      });
      await sut.loadByToken("1");
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return the account on success", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.findUnique.mockResolvedValueOnce({
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        role: "admin",
      });
      const account = await sut.loadByToken("1");
      expect(account).toEqual({
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        role: "admin",
      });
    });

    test("Should return null if account is not found", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.findUnique.mockResolvedValueOnce(null);
      const account = await sut.loadByToken("1");
      expect(account).toBeNull();
    });

    test("Should throw if prisma.account.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.findUnique.mockRejectedValueOnce(new Error());
      await expect(sut.loadByToken("1")).rejects.toThrow();
    });
  });

  describe("updateAccessToken()", () => {
    test("Should resolve without calling prisma (no-op)", async () => {
      const { sut, prisma } = makeSut();
      const result = await sut.updateAccessToken(1, "any_token");
      expect(result).toBeUndefined();
      expect(prisma.account.findUnique).not.toHaveBeenCalled();
    });
  });

  describe("updateRefreshToken()", () => {
    test("Should call prisma.account.update with correct values", async () => {
      const { sut, prisma } = makeSut();
      const expiresAt = new Date();
      await sut.updateRefreshToken(1, "any_hash", expiresAt);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshTokenHash: "any_hash", refreshTokenExpiresAt: expiresAt },
      });
    });

    test("Should call prisma.account.update with null values to revoke the token", async () => {
      const { sut, prisma } = makeSut();
      await sut.updateRefreshToken(1, null, null);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { refreshTokenHash: null, refreshTokenExpiresAt: null },
      });
    });

    test("Should throw if prisma.account.update throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.update.mockRejectedValueOnce(new Error());
      await expect(
        sut.updateRefreshToken(1, "any_hash", new Date()),
      ).rejects.toThrow();
    });
  });

  describe("loadAccountByEmail()", () => {
    test("Should call prisma.account.findUnique with correct email", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.findUnique.mockResolvedValueOnce({
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      });
      await sut.loadAccountByEmail("any_email@email.com");
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { email: "any_email@email.com" },
      });
    });

    test("Should return an account on success", async () => {
      const { sut, prisma } = makeSut();
      const fakeAccount = {
        id: 1,
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      };
      prisma.account.findUnique.mockResolvedValueOnce(fakeAccount);
      const account = await sut.loadAccountByEmail("any_email@email.com");
      expect(account).toEqual(fakeAccount);
    });

    test("Should throw if prisma.account.findUnique throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.findUnique.mockRejectedValueOnce(new Error());
      await expect(
        sut.loadAccountByEmail("any_email@email.com"),
      ).rejects.toThrow();
    });
  });

  describe("deleteById()", () => {
    test("Should call prisma.account.delete with correct id", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.delete.mockResolvedValueOnce({});
      await sut.deleteById(1);
      expect(prisma.account.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("Should return success message", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.delete.mockResolvedValueOnce({});
      const message = await sut.deleteById(1);
      expect(message).toBe("Conta deletada com sucesso!");
    });

    test("Should throw if prisma.account.delete throws", async () => {
      const { sut, prisma } = makeSut();
      prisma.account.delete.mockRejectedValueOnce(new Error());
      await expect(sut.deleteById(1)).rejects.toThrow();
    });
  });
});
