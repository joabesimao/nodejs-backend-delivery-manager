import { ChatMessagePage } from "../../models/chat/chat-message";

export interface LoadChatMessagesModel {
  accountId: number;
  limit: number;
  offset: number;
  unitStoreId?: number;
}

export interface LoadChatMessages {
  load(data: LoadChatMessagesModel): Promise<ChatMessagePage>;
}
