import { DbLoadChatStatistics } from "../../data/usescases/chat-usecases";
import { GetChatStatisticsController } from "../../presentation/controllers/chat-controllers";
import { makeAccountScopeRepository, makeChatMessageRepository } from "./repositories";

export const makeGetChatStatisticsController = (): GetChatStatisticsController => {
  const loadChatStatistics = new DbLoadChatStatistics(
    makeAccountScopeRepository(),
    makeChatMessageRepository(),
  );
  return new GetChatStatisticsController(loadChatStatistics);
};
