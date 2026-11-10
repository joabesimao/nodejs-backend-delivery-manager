import { InvalidChatMessageError } from "../../../domain/errors";
import { UpdateChatMessage } from "../../../domain/usescases/chat/update-chat-message";
import { makeFakeChatMessage } from "../../../test/chat-fixtures";
import { UpdateChatMessageController } from "./update-chat-message-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makeSut = () => {
  const updateChatMessageStub: UpdateChatMessage = {
    update: jest.fn().mockResolvedValue(makeFakeChatMessage({ text: "editado" })),
  };
  return { sut: new UpdateChatMessageController(updateChatMessageStub), updateChatMessageStub };
};

describe("UpdateChatMessage Controller", () => {
  test("Should return 401 without accountId", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ headers: {}, params: { id: "5" }, body: { text: "x" } });
    expect(response).toEqual({ statusCode: 401, body: { error: "Não autenticado" } });
  });

  test("Should return 400 for an invalid id", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "0" }, body: {} });
    expect(response).toEqual({ statusCode: 400, body: { error: "ID de mensagem inválido" } });
  });

  test("Should return 400 when the text has only spaces", async () => {
    const { sut, updateChatMessageStub } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" }, body: { text: "  " } });
    expect(response).toEqual({ statusCode: 400, body: { error: "Texto da mensagem não pode estar vazio" } });
    expect(updateChatMessageStub.update).not.toHaveBeenCalled();
  });

  test("Should call UpdateChatMessage with the trimmed text, or null when absent", async () => {
    const { sut, updateChatMessageStub } = makeSut();
    await sut.handle({ actor: makeFakeActor(), params: { id: "5" }, body: { text: " editado " } });
    expect(updateChatMessageStub.update).toHaveBeenCalledWith({ messageId: 5, accountId: 1, text: "editado" });
    await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(updateChatMessageStub.update).toHaveBeenLastCalledWith({ messageId: 5, accountId: 1, text: null });
  });

  test("Should return 200 with the updated message", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" }, body: { text: "editado" } });
    expect(response).toEqual({ statusCode: 200, body: makeFakeChatMessage({ text: "editado" }) });
  });

  test("Should map domain errors", async () => {
    const { sut, updateChatMessageStub } = makeSut();
    const error = new InvalidChatMessageError("Mensagem não pode ficar vazia");
    (updateChatMessageStub.update as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" }, body: {} });
    expect(response).toEqual({ statusCode: 400, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, updateChatMessageStub } = makeSut();
    (updateChatMessageStub.update as jest.Mock).mockRejectedValueOnce(new Error());
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" }, body: { text: "x" } });
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao atualizar mensagem" } });
  });
});
