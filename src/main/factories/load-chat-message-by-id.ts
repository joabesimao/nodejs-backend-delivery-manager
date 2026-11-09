import { makeAccountScopeRepository, makeChatMessageRepository } from "./chat-repositories";
import { DbLoadChatMessageById } from "../../data/usescases/chat-usecases";
import { LoadChatMessageByIdController } from "../../presentation/controllers/chat-controllers";

export const makeLoadChatMessageByIdController = (): LoadChatMessageByIdController => {
  const loadChatMessageById = new DbLoadChatMessageById(
    makeChatMessageRepository(),
    makeAccountScopeRepository(),
  );
  return new LoadChatMessageByIdController(loadChatMessageById);
};
