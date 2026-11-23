import { ChatAccountNotFoundError } from "../../../domain/errors";
import { makeFakeChatMessage, makeFakeScope } from "../../../test/chat-fixtures";
import { DbLoadChatMessages } from "./db-load-chat-messages";

const makeSut = () => {
  const scopeRepository = { loadScope: jest.fn().mockResolvedValue(makeFakeScope()) };
  const chatRepository = {
    loadPage: jest.fn().mockResolvedValue({
      messages: [makeFakeChatMessage({ id: 2 }), makeFakeChatMessage({ id: 1 })],
      total: 3,
    }),
  };
  return { sut: new DbLoadChatMessages(scopeRepository, chatRepository), scopeRepository, chatRepository };
};

describe("DbLoadChatMessages", () => {
  test("Should throw ChatAccountNotFoundError when the account has no scope", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(null);
    await expect(sut.load({ accountId: 1, limit: 2, offset: 0 })).rejects.toBeInstanceOf(
      ChatAccountNotFoundError,
    );
  });

  test("Should filter by the visible units", async () => {
    const { sut, chatRepository } = makeSut();
    await sut.load({ accountId: 1, limit: 2, offset: 0 });
    expect(chatRepository.loadPage).toHaveBeenCalledWith({ unitStoreIds: [10, 11] }, { limit: 2, offset: 0 });
  });

  test("Should restrict to a visible unitStoreId and ignore others", async () => {
    const { sut, chatRepository } = makeSut();
    await sut.load({ accountId: 1, limit: 2, offset: 0, unitStoreId: 11 });
    expect(chatRepository.loadPage).toHaveBeenLastCalledWith(
      { unitStoreIds: [10, 11], unitStoreId: 11 },
      { limit: 2, offset: 0 },
    );
    await sut.load({ accountId: 1, limit: 2, offset: 0, unitStoreId: 99 });
    expect(chatRepository.loadPage).toHaveBeenLastCalledWith({ unitStoreIds: [10, 11] }, { limit: 2, offset: 0 });
  });

  test("Should not filter units when the account sees none", async () => {
    const { sut, scopeRepository, chatRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(makeFakeScope({ visibleUnitIds: [] }));
    await sut.load({ accountId: 1, limit: 2, offset: 0 });
    expect(chatRepository.loadPage).toHaveBeenCalledWith({}, { limit: 2, offset: 0 });
  });

  test("Should return messages in chronological order with pagination", async () => {
    const { sut } = makeSut();
    const page = await sut.load({ accountId: 1, limit: 2, offset: 0 });
    expect(page.messages.map((message) => message.id)).toEqual([1, 2]);
    expect(page.pagination).toEqual({ total: 3, limit: 2, offset: 0, hasMore: true });
  });
});
