import { AddChatMessageController } from "../../presentation/controllers/chat-controllers";

export const makeAddChatMessageController = (): AddChatMessageController => {
  return new AddChatMessageController();
};
