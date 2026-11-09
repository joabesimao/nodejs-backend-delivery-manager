import { getAccountScope } from "../helpers/store-scope";
import { makeFakeScope } from "../../../../test/chat-fixtures";
import { AccountScopeMysqlRepository } from "./account-scope-repository";

jest.mock("../helpers/store-scope", () => ({
  getAccountScope: jest.fn(),
}));

const makeSut = () => {
  const prisma = { account: { findUnique: jest.fn().mockResolvedValue({ role: "admin" }) } };
  const sut = new AccountScopeMysqlRepository(prisma as never);
  return { sut, prisma };
};

describe("AccountScope MySql Repository", () => {
  test("loadScope() delegates to getAccountScope", async () => {
    const { sut, prisma } = makeSut();
    (getAccountScope as jest.Mock).mockResolvedValueOnce(makeFakeScope());
    const scope = await sut.loadScope(1);
    expect(getAccountScope).toHaveBeenCalledWith(prisma, 1);
    expect(scope).toEqual(makeFakeScope());
  });

  test("loadRole() returns the account role", async () => {
    const { sut, prisma } = makeSut();
    expect(await sut.loadRole(1)).toBe("admin");
    expect(prisma.account.findUnique).toHaveBeenCalledWith({ where: { id: 1 }, select: { role: true } });
  });

  test("loadRole() returns null when the account does not exist", async () => {
    const { sut, prisma } = makeSut();
    prisma.account.findUnique.mockResolvedValueOnce(null);
    expect(await sut.loadRole(1)).toBeNull();
  });
});
