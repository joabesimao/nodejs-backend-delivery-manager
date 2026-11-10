import { ChatMessageNotFoundError } from "../../../domain/errors";
import { LoadChatMessageById } from "../../../domain/usescases/chat/load-chat-message-by-id";
import { makeFakeChatMessage } from "../../../test/chat-fixtures";
import { LoadChatMessageByIdController } from "./load-chat-message-by-id-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makeSut = () => {
  const loadChatMessageByIdStub: LoadChatMessageById = {
    loadById: jest.fn().mockResolvedValue(makeFakeChatMessage()),
  };
  return { sut: new LoadChatMessageByIdController(loadChatMessageByIdStub), loadChatMessageByIdStub };
};

describe("LoadChatMessageById Controller", () => {
  test("Should return 401 without accountId", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ headers: {}, params: { id: "5" } });
    expect(response).toEqual({ statusCode: 401, body: { error: "Não autenticado" } });
  });

  test("Should return 400 for an invalid id", async () => {
    const { sut, loadChatMessageByIdStub } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "abc" } });
    expect(response).toEqual({ statusCode: 400, body: { error: "ID de mensagem inválido" } });
    expect(loadChatMessageByIdStub.loadById).not.toHaveBeenCalled();
  });

  test("Should return 200 with the message", async () => {
    const { sut, loadChatMessageByIdStub } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(loadChatMessageByIdStub.loadById).toHaveBeenCalledWith(5, 1);
    expect(response).toEqual({ statusCode: 200, body: makeFakeChatMessage() });
  });

  test("Should return 404 when the message does not exist", async () => {
    const { sut, loadChatMessageByIdStub } = makeSut();
    const error = new ChatMessageNotFoundError();
    (loadChatMessageByIdStub.loadById as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(response).toEqual({ statusCode: 404, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, loadChatMessageByIdStub } = makeSut();
    (loadChatMessageByIdStub.loadById as jest.Mock).mockRejectedValueOnce(new Error());
    const response = await sut.handle({ actor: makeFakeActor(), params: { id: "5" } });
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao carregar mensagem" } });
  });
});
