import { ChatMessage } from "../../models/chat/chat-message";

export interface LoadChatMessageById {
  loadById(messageId: number, accountId: number): Promise<ChatMessage>;
}
