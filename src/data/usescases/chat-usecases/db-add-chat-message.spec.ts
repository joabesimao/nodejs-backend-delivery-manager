import {
  ChatAccountNotFoundError,
  ChatPermissionDeniedError,
  InvalidChatMessageError,
} from "../../../domain/errors";
import { AddChatMessageModel } from "../../../domain/usescases/chat/add-chat-message";
import { makeFakeChatMessage, makeFakeScope } from "../../../test/chat-fixtures";
import { DbAddChatMessage } from "./db-add-chat-message";

const makeInput = (overrides: Partial<AddChatMessageModel> = {}): AddChatMessageModel => ({
  accountId: 1,
  unitStoreId: 11,
  text: "olá",
  imageBase64: null,
  imageMimeType: null,
  ...overrides,
});

const makeSut = () => {
  const scopeRepository = { loadScope: jest.fn().mockResolvedValue(makeFakeScope()) };
  const chatRepository = { add: jest.fn().mockResolvedValue(makeFakeChatMessage()) };
  const publisher = { publishMessage: jest.fn(), publishDeleted: jest.fn() };
  const notifyChatMessage = { notify: jest.fn().mockResolvedValue(undefined) };
  const sut = new DbAddChatMessage(scopeRepository, chatRepository, publisher, notifyChatMessage);
  return { sut, scopeRepository, chatRepository, publisher, notifyChatMessage };
};

describe("DbAddChatMessage", () => {
  test("Should throw ChatAccountNotFoundError when the account has no scope", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(null);
    await expect(sut.add(makeInput())).rejects.toBeInstanceOf(ChatAccountNotFoundError);
  });

  test("Should use the first visible unit when unitStoreId is not sent", async () => {
    const { sut, chatRepository } = makeSut();
    await sut.add(makeInput({ unitStoreId: 0 }));
    expect(chatRepository.add).toHaveBeenCalledWith(expect.objectContaining({ unitStoreId: 10 }));
  });

  test("Should deny when the account sees no unit", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(makeFakeScope({ visibleUnitIds: [] }));
    await expect(sut.add(makeInput({ unitStoreId: undefined }))).rejects.toThrow(
      new ChatPermissionDeniedError("Sem permissão para enviar para nenhuma loja"),
    );
  });

  test("Should deny a unit outside the scope", async () => {
    const { sut, chatRepository } = makeSut();
    await expect(sut.add(makeInput({ unitStoreId: 99 }))).rejects.toThrow(
      new ChatPermissionDeniedError("Sem permissão para enviar para essa loja"),
    );
    expect(chatRepository.add).not.toHaveBeenCalled();
  });

  test("Should reject images larger than 5MB", async () => {
    const { sut, chatRepository } = makeSut();
    const bigImage = "A".repeat(Math.ceil((5 * 1024 * 1024 * 4) / 3) + 8);
    await expect(sut.add(makeInput({ imageBase64: bigImage }))).rejects.toThrow(
      new InvalidChatMessageError("Imagem excede o tamanho máximo de 5MB"),
    );
    expect(chatRepository.add).not.toHaveBeenCalled();
  });

  test("Should strip the data: prefix and save null for empty fields", async () => {
    const { sut, chatRepository } = makeSut();
    await sut.add(makeInput({ text: null, imageBase64: "data:image/png;base64,QUJD", imageMimeType: "image/png" }));
    expect(chatRepository.add).toHaveBeenCalledWith({
      unitStoreId: 11,
      senderId: 1,
      text: null,
      imageBase64: "QUJD",
      imageMimeType: "image/png",
    });
  });

  test("Should publish the message, notify and return it", async () => {
    const { sut, publisher, notifyChatMessage } = makeSut();
    const message = await sut.add(makeInput());
    expect(message).toEqual(makeFakeChatMessage());
    expect(publisher.publishMessage).toHaveBeenCalledWith(10, makeFakeChatMessage());
    expect(notifyChatMessage.notify).toHaveBeenCalledWith({
      messageId: 5,
      unitStoreId: 10,
      unitStoreName: "any_store",
      senderId: 1,
      senderName: "any_name",
      text: "any_text",
      hasImage: false,
    });
  });

  test("Should throw if the repository throws", async () => {
    const { sut, chatRepository, publisher } = makeSut();
    chatRepository.add.mockRejectedValueOnce(new Error());
    await expect(sut.add(makeInput())).rejects.toThrow();
    expect(publisher.publishMessage).not.toHaveBeenCalled();
  });
});
