import { AddAccountMySqlRepository } from "./signup-repository";

const makeFakeAccount = () => ({
  id: 1,
  name: "any_name",
  email: "any_email@email.com",
  password: "any_password",
});

const makeFakePrisma = () => ({
  account: {
    create: jest.fn().mockResolvedValue(makeFakeAccount()),
  },
});

type FakePrisma = ReturnType<typeof makeFakePrisma>;

const makeSut = (): { sut: AddAccountMySqlRepository; prisma: FakePrisma } => {
  const prisma = makeFakePrisma();
  const sut = new AddAccountMySqlRepository(prisma as any);
  return { sut, prisma };
};

describe("AddAccount MySql Repository", () => {
  const fakeAddAccount = {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
  };

  test("Should call prisma.account.create with correct values", async () => {
    const { sut, prisma } = makeSut();
    await sut.add(fakeAddAccount);
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: fakeAddAccount,
    });
  });

  test("Should return an account on success", async () => {
    const { sut } = makeSut();
    const account = await sut.add(fakeAddAccount);
    expect(account).toEqual(makeFakeAccount());
  });

  test("Should throw if prisma.account.create throws", async () => {
    const { sut, prisma } = makeSut();
    prisma.account.create.mockRejectedValueOnce(new Error());
    await expect(sut.add(fakeAddAccount)).rejects.toThrow();
  });

  test("Should forward role to prisma.account.create when present", async () => {
    const { sut, prisma } = makeSut();
    await sut.add({ ...fakeAddAccount, role: "entregador" as any });
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: { ...fakeAddAccount, role: "entregador" },
    });
  });

  test("Should omit role from prisma.account.create when absent", async () => {
    const { sut, prisma } = makeSut();
    await sut.add(fakeAddAccount);
    expect(prisma.account.create).toHaveBeenCalledWith({
      data: fakeAddAccount,
    });
  });
});
