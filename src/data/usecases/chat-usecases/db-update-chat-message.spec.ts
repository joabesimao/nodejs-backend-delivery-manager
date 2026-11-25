import {
  ChatMessageNotFoundError,
  ChatPermissionDeniedError,
  InvalidChatMessageError,
} from "../../../domain/errors";
import { makeFakeChatMessage } from "../../../test/chat-fixtures";
import { DbUpdateChatMessage } from "./db-update-chat-message";

const makeSut = () => {
  const ownershipRepository = {
    loadOwnership: jest.fn().mockResolvedValue({ id: 5, senderId: 1, unitStoreId: 11, imageBase64: null }),
  };
  const roleRepository = { loadRole: jest.fn().mockResolvedValue("user") };
  const updateRepository = { updateText: jest.fn().mockResolvedValue(makeFakeChatMessage({ text: "editado" })) };
  const sut = new DbUpdateChatMessage(ownershipRepository, roleRepository, updateRepository);
  return { sut, ownershipRepository, roleRepository, updateRepository };
};

describe("DbUpdateChatMessage", () => {
  test("Should throw ChatMessageNotFoundError when the message does not exist", async () => {
    const { sut, ownershipRepository } = makeSut();
    ownershipRepository.loadOwnership.mockResolvedValueOnce(null);
    await expect(sut.update({ messageId: 5, accountId: 1, text: "x" })).rejects.toBeInstanceOf(
      ChatMessageNotFoundError,
    );
  });

  test("Should deny who is neither the author nor admin", async () => {
    const { sut, updateRepository } = makeSut();
    await expect(sut.update({ messageId: 5, accountId: 2, text: "x" })).rejects.toThrow(
      new ChatPermissionDeniedError("Sem permissão para editar esta mensagem"),
    );
    expect(updateRepository.updateText).not.toHaveBeenCalled();
  });

  test("Should allow an admin to edit someone else's message", async () => {
    const { sut, roleRepository, updateRepository } = makeSut();
    roleRepository.loadRole.mockResolvedValueOnce("admin");
    await sut.update({ messageId: 5, accountId: 2, text: "x" });
    expect(roleRepository.loadRole).toHaveBeenCalledWith(2);
    expect(updateRepository.updateText).toHaveBeenCalledWith(5, "x");
  });

  test("Should reject clearing the text of a message without image", async () => {
    const { sut } = makeSut();
    await expect(sut.update({ messageId: 5, accountId: 1, text: null })).rejects.toThrow(
      new InvalidChatMessageError("Mensagem não pode ficar vazia"),
    );
  });

  test("Should allow clearing the text of a message with image", async () => {
    const { sut, ownershipRepository, updateRepository } = makeSut();
    ownershipRepository.loadOwnership.mockResolvedValueOnce({ id: 5, senderId: 1, unitStoreId: 11, imageBase64: "QUJD" });
    await sut.update({ messageId: 5, accountId: 1, text: null });
    expect(updateRepository.updateText).toHaveBeenCalledWith(5, null);
  });

  test("Should return the updated message", async () => {
    const { sut } = makeSut();
    const message = await sut.update({ messageId: 5, accountId: 1, text: "editado" });
    expect(message).toEqual(makeFakeChatMessage({ text: "editado" }));
  });
});
