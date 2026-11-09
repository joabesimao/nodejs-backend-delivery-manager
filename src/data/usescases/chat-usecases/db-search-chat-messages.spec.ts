import { ChatAccountNotFoundError } from "../../../domain/errors";
import { makeFakeScope } from "../../../test/chat-fixtures";
import { DbSearchChatMessages } from "./db-search-chat-messages";

const makeSut = () => {
  const scopeRepository = { loadScope: jest.fn().mockResolvedValue(makeFakeScope()) };
  const chatRepository = { loadPage: jest.fn().mockResolvedValue({ messages: [], total: 0 }) };
  return { sut: new DbSearchChatMessages(scopeRepository, chatRepository), scopeRepository, chatRepository };
};

describe("DbSearchChatMessages", () => {
  test("Should throw ChatAccountNotFoundError when the account has no scope", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(null);
    await expect(sut.search({ accountId: 1, limit: 50, offset: 0 })).rejects.toBeInstanceOf(
      ChatAccountNotFoundError,
    );
  });

  test("Should search without scope when there is no accountId", async () => {
    const { sut, scopeRepository, chatRepository } = makeSut();
    await sut.search({ limit: 50, offset: 0, unitStoreId: 99 });
    expect(scopeRepository.loadScope).not.toHaveBeenCalled();
    expect(chatRepository.loadPage).toHaveBeenCalledWith({ unitStoreId: 99 }, { limit: 50, offset: 0 });
  });

  test("Should build the filter from every criterion", async () => {
    const { sut, chatRepository } = makeSut();
    const dateTo = new Date("2026-11-06T12:00:00.000Z");
    const endOfDay = new Date(dateTo);
    endOfDay.setHours(23, 59, 59, 999);
    await sut.search({
      accountId: 1,
      searchText: "pedido",
      unitStoreId: 11,
      senderId: 3,
      limit: 100,
      offset: 10,
      dateFrom: new Date("2026-11-01T00:00:00.000Z"),
      dateTo,
      hasImage: true,
      hasText: true,
    });
    expect(chatRepository.loadPage).toHaveBeenCalledWith(
      {
        unitStoreIds: [10, 11],
        unitStoreId: 11,
        senderId: 3,
        createdFrom: new Date("2026-11-01T00:00:00.000Z"),
        createdTo: endOfDay,
        withImage: true,
        withText: true,
        searchText: "pedido",
      },
      { limit: 100, offset: 10 },
    );
  });

  test("Should ignore a unitStoreId outside the scope", async () => {
    const { sut, chatRepository } = makeSut();
    await sut.search({ accountId: 1, limit: 50, offset: 0, unitStoreId: 99 });
    expect(chatRepository.loadPage).toHaveBeenCalledWith({ unitStoreIds: [10, 11] }, { limit: 50, offset: 0 });
  });

  test("Should return the page", async () => {
    const { sut } = makeSut();
    const page = await sut.search({ accountId: 1, limit: 50, offset: 0 });
    expect(page).toEqual({ messages: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } });
  });
});
