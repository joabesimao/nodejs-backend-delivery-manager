import { GetChatStatisticsController } from "../../presentation/controllers/chat-controllers";

export const makeGetChatStatisticsController = (): GetChatStatisticsController => {
  return new GetChatStatisticsController();
};
