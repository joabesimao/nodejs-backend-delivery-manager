import { makeAccountScopeRepository, makeChatMessageRepository } from "./chat-repositories";
import { DbSearchChatMessages } from "../../data/usescases/chat-usecases";
import { SearchChatMessagesController } from "../../presentation/controllers/chat-controllers";

export const makeSearchChatMessagesController = (): SearchChatMessagesController => {
  const searchChatMessages = new DbSearchChatMessages(
    makeAccountScopeRepository(),
    makeChatMessageRepository(),
  );
  return new SearchChatMessagesController(searchChatMessages);
};
