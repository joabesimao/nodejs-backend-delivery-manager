import { makeNotifyChatMessage } from "./notify-chat-message";
import { DbAddChatMessage } from "../../data/usescases/chat-usecases";
import { SocketChatEventPublisher } from "../realtime/socket-chat-event-publisher";
import { AddChatMessageController } from "../../presentation/controllers/chat-controllers";
import { makeAccountScopeRepository, makeChatMessageRepository } from "./repositories";

export const makeAddChatMessageController = (): AddChatMessageController => {
  const addChatMessage = new DbAddChatMessage(
    makeAccountScopeRepository(),
    makeChatMessageRepository(),
    new SocketChatEventPublisher(),
    makeNotifyChatMessage(),
  );
  return new AddChatMessageController(addChatMessage);
};
