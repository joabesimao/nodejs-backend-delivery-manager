import { DeleteChatMessageController } from "../../presentation/controllers/chat-controllers";

export const makeDeleteChatMessageController = (): DeleteChatMessageController => {
  return new DeleteChatMessageController();
};
