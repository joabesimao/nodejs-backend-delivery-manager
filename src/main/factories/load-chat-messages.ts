import { makeAccountScopeRepository, makeChatMessageRepository } from "./chat-repositories";
import { DbLoadChatMessages } from "../../data/usescases/chat-usecases";
import { LoadChatMessagesController } from "../../presentation/controllers/chat-controllers";

export const makeLoadChatMessagesController = (): LoadChatMessagesController => {
  const loadChatMessages = new DbLoadChatMessages(
    makeAccountScopeRepository(),
    makeChatMessageRepository(),
  );
  return new LoadChatMessagesController(loadChatMessages);
};
