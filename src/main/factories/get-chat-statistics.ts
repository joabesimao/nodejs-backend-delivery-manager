import { makeAccountScopeRepository, makeChatMessageRepository } from "./chat-repositories";
import { DbLoadChatStatistics } from "../../data/usescases/chat-usecases";
import { GetChatStatisticsController } from "../../presentation/controllers/chat-controllers";

export const makeGetChatStatisticsController = (): GetChatStatisticsController => {
  const loadChatStatistics = new DbLoadChatStatistics(
    makeAccountScopeRepository(),
    makeChatMessageRepository(),
  );
  return new GetChatStatisticsController(loadChatStatistics);
};
