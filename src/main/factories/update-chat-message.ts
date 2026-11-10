import { DbUpdateChatMessage } from "../../data/usescases/chat-usecases";
import { UpdateChatMessageController } from "../../presentation/controllers/chat-controllers";
import { makeAccountScopeRepository, makeChatMessageRepository } from "./repositories";

export const makeUpdateChatMessageController = (): UpdateChatMessageController => {
  const chatMessageRepository = makeChatMessageRepository();
  const updateChatMessage = new DbUpdateChatMessage(
    chatMessageRepository,
    makeAccountScopeRepository(),
    chatMessageRepository,
  );
  return new UpdateChatMessageController(updateChatMessage);
};
