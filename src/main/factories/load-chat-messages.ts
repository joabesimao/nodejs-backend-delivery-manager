import { DbLoadChatMessages } from "../../data/usecases/chat-usecases";
import { LoadChatMessagesController } from "../../presentation/controllers/chat-controllers";
import { makeAccountScopeRepository, makeChatMessageRepository } from "./repositories";

export const makeLoadChatMessagesController = (): LoadChatMessagesController => {
  const loadChatMessages = new DbLoadChatMessages(
    makeAccountScopeRepository(),
    makeChatMessageRepository(),
  );
  return new LoadChatMessagesController(loadChatMessages);
};
