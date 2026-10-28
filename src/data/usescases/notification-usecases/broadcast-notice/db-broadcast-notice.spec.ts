import { DbBroadcastNotice } from "./db-broadcast-notice";
import { AccessDeniedError } from "../../../../presentation/errors/access-denied-error";

const makeSut = () => {
  const repository = {
    loadVisibleUnitIds: jest.fn().mockResolvedValue([1, 2]),
    loadRecipientIds: jest.fn().mockResolvedValue([3, 4]),
  };
  const notifyAccounts = { notify: jest.fn().mockResolvedValue(2) };
  return { sut: new DbBroadcastNotice(repository, repository, notifyAccounts), repository, notifyAccounts };
};

describe("DbBroadcastNotice", () => {
  test("Should notify the accounts within the sender scope", async () => {
    const { sut, repository, notifyAccounts } = makeSut();
    const count = await sut.broadcast({ senderId: 1, title: "t", body: "b", roles: ["user"] });
    expect(repository.loadRecipientIds).toHaveBeenCalledWith({
      roles: ["user"],
      unitStoreIds: [1, 2],
      excludeAccountIds: [1],
    });
    expect(notifyAccounts.notify).toHaveBeenCalledWith({
      recipientIds: [3, 4],
      type: "admin_notice",
      title: "t",
      body: "b",
      data: { senderId: 1 },
    });
    expect(count).toBe(2);
  });

  test("Should restrict to the requested unit", async () => {
    const { sut, repository } = makeSut();
    await sut.broadcast({ senderId: 1, title: "t", body: "b", unitStoreId: 2 });
    expect(repository.loadRecipientIds).toHaveBeenCalledWith({
      roles: undefined,
      unitStoreIds: [2],
      excludeAccountIds: [1],
    });
  });

  test("Should throw AccessDeniedError for a unit outside the sender scope", async () => {
    const { sut } = makeSut();
    await expect(sut.broadcast({ senderId: 1, title: "t", body: "b", unitStoreId: 9 })).rejects.toThrow(
      AccessDeniedError
    );
  });

  test("Should not restrict units when the sender has no unit", async () => {
    const { sut, repository } = makeSut();
    repository.loadVisibleUnitIds.mockResolvedValueOnce(null);
    await sut.broadcast({ senderId: 1, title: "t", body: "b" });
    expect(repository.loadRecipientIds).toHaveBeenCalledWith(expect.objectContaining({ unitStoreIds: undefined }));
  });

  test("Should return 0 without notifying when there are no recipients", async () => {
    const { sut, repository, notifyAccounts } = makeSut();
    repository.loadRecipientIds.mockResolvedValueOnce([]);
    expect(await sut.broadcast({ senderId: 1, title: "t", body: "b" })).toBe(0);
    expect(notifyAccounts.notify).not.toHaveBeenCalled();
  });
});
