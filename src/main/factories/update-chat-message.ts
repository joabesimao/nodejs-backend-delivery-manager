import { UpdateChatMessageController } from "../../presentation/controllers/chat-controllers";

export const makeUpdateChatMessageController = (): UpdateChatMessageController => {
  return new UpdateChatMessageController();
};
