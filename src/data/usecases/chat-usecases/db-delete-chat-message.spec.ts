import { ChatMessageNotFoundError, ChatPermissionDeniedError } from "../../../domain/errors";
import { makeFakeScope } from "../../../test/chat-fixtures";
import { DbDeleteChatMessage } from "./db-delete-chat-message";

const makeSut = () => {
  const ownershipRepository = {
    loadOwnership: jest.fn().mockResolvedValue({ id: 5, senderId: 99, unitStoreId: 11, imageBase64: null }),
  };
  const roleRepository = { loadRole: jest.fn().mockResolvedValue("admin") };
  const scopeRepository = { loadScope: jest.fn().mockResolvedValue(makeFakeScope()) };
  const deleteRepository = { deleteById: jest.fn().mockResolvedValue(undefined) };
  const publisher = { publishMessage: jest.fn(), publishDeleted: jest.fn() };
  const sut = new DbDeleteChatMessage(
    ownershipRepository,
    roleRepository,
    scopeRepository,
    deleteRepository,
    publisher,
  );
  return { sut, ownershipRepository, roleRepository, scopeRepository, deleteRepository, publisher };
};

const denied = new ChatPermissionDeniedError("Sem permissão para deletar esta mensagem");

describe("DbDeleteChatMessage", () => {
  test("Should throw ChatMessageNotFoundError when the message does not exist", async () => {
    const { sut, ownershipRepository } = makeSut();
    ownershipRepository.loadOwnership.mockResolvedValueOnce(null);
    await expect(sut.delete(5, 1)).rejects.toBeInstanceOf(ChatMessageNotFoundError);
  });

  test("Should deny who is neither the author nor admin", async () => {
    const { sut, roleRepository, deleteRepository } = makeSut();
    roleRepository.loadRole.mockResolvedValueOnce("user");
    await expect(sut.delete(5, 1)).rejects.toThrow(denied);
    expect(deleteRepository.deleteById).not.toHaveBeenCalled();
  });

  test("Should deny a message outside the scope even for admins", async () => {
    const { sut, ownershipRepository } = makeSut();
    ownershipRepository.loadOwnership.mockResolvedValueOnce({ id: 5, senderId: 1, unitStoreId: 77, imageBase64: null });
    await expect(sut.delete(5, 1)).rejects.toThrow(denied);
  });

  test("Should allow when the account has no scope or sees every unit", async () => {
    const { sut, scopeRepository, deleteRepository, publisher } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(null);
    await sut.delete(5, 1);
    expect(deleteRepository.deleteById).toHaveBeenCalledWith(5);
    expect(publisher.publishDeleted).toHaveBeenCalledWith(null, { messageId: 5 });

    scopeRepository.loadScope.mockResolvedValueOnce(makeFakeScope({ visibleUnitIds: [] }));
    await sut.delete(5, 1);
    expect(deleteRepository.deleteById).toHaveBeenCalledTimes(2);
  });

  test("Should delete and publish to the network room", async () => {
    const { sut, deleteRepository, publisher } = makeSut();
    await sut.delete(5, 1);
    expect(deleteRepository.deleteById).toHaveBeenCalledWith(5);
    expect(publisher.publishDeleted).toHaveBeenCalledWith(10, { messageId: 5 });
  });
});
