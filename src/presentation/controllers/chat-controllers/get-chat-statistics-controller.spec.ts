import { ChatAccountNotFoundError } from "../../../domain/errors";
import { LoadChatStatistics } from "../../../domain/usescases/chat/load-chat-statistics";
import { makeFakeChatStatistics } from "../../../test/chat-fixtures";
import { GetChatStatisticsController } from "./get-chat-statistics-controller";
import { makeFakeActor } from "../../../test/actor-fixtures";

const makeSut = () => {
  const loadChatStatisticsStub: LoadChatStatistics = {
    load: jest.fn().mockResolvedValue(makeFakeChatStatistics()),
  };
  return { sut: new GetChatStatisticsController(loadChatStatisticsStub), loadChatStatisticsStub };
};

describe("GetChatStatistics Controller", () => {
  test("Should pass the accountId from the actor, query or none", async () => {
    const { sut, loadChatStatisticsStub } = makeSut();
    await sut.handle({ actor: makeFakeActor() });
    expect(loadChatStatisticsStub.load).toHaveBeenLastCalledWith(1);
    await sut.handle({ headers: {}, query: { accountId: "2" } });
    expect(loadChatStatisticsStub.load).toHaveBeenLastCalledWith(2);
    await sut.handle({ headers: {} });
    expect(loadChatStatisticsStub.load).toHaveBeenLastCalledWith(undefined);
  });

  test("Should return 200 with the statistics", async () => {
    const { sut } = makeSut();
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 200, body: { statistics: makeFakeChatStatistics() } });
  });

  test("Should return 404 when the account does not exist", async () => {
    const { sut, loadChatStatisticsStub } = makeSut();
    const error = new ChatAccountNotFoundError();
    (loadChatStatisticsStub.load as jest.Mock).mockRejectedValueOnce(error);
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 404, body: error });
  });

  test("Should return 500 on unexpected errors", async () => {
    const { sut, loadChatStatisticsStub } = makeSut();
    (loadChatStatisticsStub.load as jest.Mock).mockRejectedValueOnce(new Error());
    const response = await sut.handle({ actor: makeFakeActor() });
    expect(response).toEqual({ statusCode: 500, body: { error: "Falha ao carregar estatísticas" } });
  });
});
