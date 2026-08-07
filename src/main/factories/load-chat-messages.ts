import { LoadChatMessagesController } from "../../presentation/controllers/chat-controllers";

export const makeLoadChatMessagesController = (): LoadChatMessagesController => {
  return new LoadChatMessagesController();
};
