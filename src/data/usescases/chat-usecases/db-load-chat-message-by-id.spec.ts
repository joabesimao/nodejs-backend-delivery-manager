import { ChatMessageNotFoundError, ChatPermissionDeniedError } from "../../../domain/errors";
import { makeFakeChatMessage, makeFakeScope } from "../../../test/chat-fixtures";
import { DbLoadChatMessageById } from "./db-load-chat-message-by-id";

const makeSut = () => {
  const chatRepository = { loadById: jest.fn().mockResolvedValue(makeFakeChatMessage({ unitStoreId: 11 })) };
  const scopeRepository = { loadScope: jest.fn().mockResolvedValue(makeFakeScope()) };
  return { sut: new DbLoadChatMessageById(chatRepository, scopeRepository), chatRepository, scopeRepository };
};

describe("DbLoadChatMessageById", () => {
  test("Should throw ChatMessageNotFoundError when the message does not exist", async () => {
    const { sut, chatRepository, scopeRepository } = makeSut();
    chatRepository.loadById.mockResolvedValueOnce(null);
    await expect(sut.loadById(5, 1)).rejects.toBeInstanceOf(ChatMessageNotFoundError);
    expect(scopeRepository.loadScope).not.toHaveBeenCalled();
  });

  test("Should deny a message outside the scope", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(makeFakeScope({ visibleUnitIds: [10] }));
    await expect(sut.loadById(5, 1)).rejects.toThrow(
      new ChatPermissionDeniedError("Sem permissão para acessar essa mensagem"),
    );
  });

  test("Should deny when the account has no scope", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(null);
    await expect(sut.loadById(5, 1)).rejects.toBeInstanceOf(ChatPermissionDeniedError);
  });

  test("Should return the message in scope", async () => {
    const { sut, chatRepository } = makeSut();
    const message = await sut.loadById(5, 1);
    expect(chatRepository.loadById).toHaveBeenCalledWith(5);
    expect(message).toEqual(makeFakeChatMessage({ unitStoreId: 11 }));
  });
});
