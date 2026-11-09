import { ChatAccountNotFoundError } from "../../../domain/errors";
import { makeFakeChatStatistics, makeFakeScope } from "../../../test/chat-fixtures";
import { DbLoadChatStatistics } from "./db-load-chat-statistics";

const makeSut = () => {
  const scopeRepository = { loadScope: jest.fn().mockResolvedValue(makeFakeScope()) };
  const statisticsRepository = { loadStatistics: jest.fn().mockResolvedValue(makeFakeChatStatistics()) };
  return {
    sut: new DbLoadChatStatistics(scopeRepository, statisticsRepository),
    scopeRepository,
    statisticsRepository,
  };
};

describe("DbLoadChatStatistics", () => {
  test("Should throw ChatAccountNotFoundError when the account has no scope", async () => {
    const { sut, scopeRepository } = makeSut();
    scopeRepository.loadScope.mockResolvedValueOnce(null);
    await expect(sut.load(1)).rejects.toBeInstanceOf(ChatAccountNotFoundError);
  });

  test("Should load statistics of the visible units", async () => {
    const { sut, statisticsRepository } = makeSut();
    const statistics = await sut.load(1);
    expect(statisticsRepository.loadStatistics).toHaveBeenCalledWith([10, 11]);
    expect(statistics).toEqual(makeFakeChatStatistics());
  });

  test("Should load global statistics without account or visible units", async () => {
    const { sut, scopeRepository, statisticsRepository } = makeSut();
    await sut.load();
    expect(scopeRepository.loadScope).not.toHaveBeenCalled();
    expect(statisticsRepository.loadStatistics).toHaveBeenLastCalledWith(undefined);

    scopeRepository.loadScope.mockResolvedValueOnce(makeFakeScope({ visibleUnitIds: [] }));
    await sut.load(1);
    expect(statisticsRepository.loadStatistics).toHaveBeenLastCalledWith(undefined);
  });
});
