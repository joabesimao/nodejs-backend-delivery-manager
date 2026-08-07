import { SearchChatMessagesController } from "../../presentation/controllers/chat-controllers";

export const makeSearchChatMessagesController = (): SearchChatMessagesController => {
  return new SearchChatMessagesController();
};
