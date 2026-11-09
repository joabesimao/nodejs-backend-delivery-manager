import { ChatMessage } from "../../../../domain/models/chat/chat-message";

export interface UpdateChatMessageTextRepository {
  updateText(id: number, text: string | null): Promise<ChatMessage>;
}
