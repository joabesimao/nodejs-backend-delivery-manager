import { makeAccountScopeRepository, makeChatMessageRepository } from "./chat-repositories";
import { DbDeleteChatMessage } from "../../data/usescases/chat-usecases";
import { SocketChatEventPublisher } from "../realtime/socket-chat-event-publisher";
import { DeleteChatMessageController } from "../../presentation/controllers/chat-controllers";

export const makeDeleteChatMessageController = (): DeleteChatMessageController => {
  const chatMessageRepository = makeChatMessageRepository();
  const accountScopeRepository = makeAccountScopeRepository();
  const deleteChatMessage = new DbDeleteChatMessage(
    chatMessageRepository,
    accountScopeRepository,
    accountScopeRepository,
    chatMessageRepository,
    new SocketChatEventPublisher(),
  );
  return new DeleteChatMessageController(deleteChatMessage);
};
