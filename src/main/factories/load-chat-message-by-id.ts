import { LoadChatMessageByIdController } from "../../presentation/controllers/chat-controllers";

export const makeLoadChatMessageByIdController = (): LoadChatMessageByIdController => {
  return new LoadChatMessageByIdController();
};
