import { ChatPermissionDeniedError } from "../../../domain/errors";
import { DeleteChatMessage } from "../../../domain/usescases/chat/delete-chat-message";
import { DeleteChatMessageController } from "./delete-chat-message-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makeSut = () => {
  const deleteChatMessageStub: DeleteChatMessage = {
    delete: jest.fn().mockResolvedValue(undefined),
  };
  return { sut: new DeleteChatMessageController(deleteChatMessageStub), deleteChatMessageStub };
};

describe("DeleteChatMessage Controller", () => {
  test("Should return 401 without accountId", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ headers: {}, params: { id: "5" } });
    expect(response).toEqual({ statusCode: 401, body: { error: "Não autenticado" } });
  });

  test("Should return 400 for an invalid id", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: {} });
    expect(response).toEqual({ statusCode: 400, body: { error: "ID de mensagem inválido" } });
  });

  test("Should return 200 after deleting", async () => {
    const { sut, deleteChatMessageStub } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(deleteChatMessageStub.delete).toHaveBeenCalledWith(5, 1);
    expect(response).toEqual({
      statusCode: 200,
      body: { success: true, message: "Mensagem deletada com sucesso" },
    });
  });

  test("Should map domain errors", async () => {
    const { sut, deleteChatMessageStub } = makeSut();
    const error = new ChatPermissionDeniedError("Sem permissão para deletar esta mensagem");
    (deleteChatMessageStub.delete as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(response).toEqual({ statusCode: 403, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, deleteChatMessageStub } = makeSut();
    (deleteChatMessageStub.delete as jest.Mock).mockRejectedValueOnce(new Error());
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao deletar mensagem" } });
  });
});
