import { ChatMessage } from "../../models/chat/chat-message";

export interface UpdateChatMessageModel {
  messageId: number;
  accountId: number;
  text: string | null;
}

export interface UpdateChatMessage {
  update(data: UpdateChatMessageModel): Promise<ChatMessage>;
}
