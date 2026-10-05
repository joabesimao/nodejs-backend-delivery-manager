import { DbNotifyChatMessage } from "./db-notify-chat-message";
import { NotifyChatMessageModel } from "../../../../domain/usescases/notification/notify-chat-message";

const makeMessage = (overrides: Partial<NotifyChatMessageModel> = {}): NotifyChatMessageModel => ({
  messageId: 10,
  unitStoreId: 2,
  unitStoreName: "Loja Centro",
  senderId: 1,
  senderName: "Ana",
  text: "Olá",
  hasImage: false,
  ...overrides,
});

const makeSut = () => {
  const repository = {
    loadNetworkUnitIds: jest.fn().mockResolvedValue([1, 2, 3]),
    loadRecipientIds: jest.fn().mockResolvedValueOnce([5, 6]).mockResolvedValueOnce([7]),
  };
  const notifyAccounts = { notify: jest.fn().mockResolvedValue(3) };
  return { sut: new DbNotifyChatMessage(repository, repository, notifyAccounts), repository, notifyAccounts };
};

describe("DbNotifyChatMessage", () => {
  test("Should notify unit members and network admins, aggregated per unit", async () => {
    const { sut, repository, notifyAccounts } = makeSut();
    await sut.notify(makeMessage());
    expect(repository.loadNetworkUnitIds).toHaveBeenCalledWith(2);
    expect(repository.loadRecipientIds).toHaveBeenCalledWith({ unitStoreIds: [2], excludeAccountIds: [1] });
    expect(repository.loadRecipientIds).toHaveBeenCalledWith({
      roles: ["admin"],
      unitStoreIds: [1, 2, 3],
      excludeAccountIds: [1],
    });
    const model = notifyAccounts.notify.mock.calls[0][0];
    expect(model).toEqual(
      expect.objectContaining({
        recipientIds: [5, 6, 7],
        type: "chat_message",
        title: "Nova mensagem no chat da Loja Centro",
        body: "Ana: Olá",
        link: "/chat",
        dedupeKey: "chat:unit:2",
        dedupe: "aggregate",
      })
    );
    expect(model.aggregateTitle(4)).toBe("4 novas mensagens no chat da Loja Centro");
  });

  test("Should describe image messages and truncate long texts", async () => {
    const { sut, notifyAccounts } = makeSut();
    await sut.notify(makeMessage({ text: null, hasImage: true }));
    expect(notifyAccounts.notify.mock.calls[0][0].body).toBe("Ana: enviou uma imagem");

    const second = makeSut();
    await second.sut.notify(makeMessage({ text: "a".repeat(300) }));
    expect(second.notifyAccounts.notify.mock.calls[0][0].body).toHaveLength("Ana: ".length + 120);
  });

  test("Should never throw", async () => {
    const { sut, repository } = makeSut();
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    repository.loadNetworkUnitIds.mockRejectedValueOnce(new Error());
    await expect(sut.notify(makeMessage())).resolves.toBeUndefined();
  });
});
