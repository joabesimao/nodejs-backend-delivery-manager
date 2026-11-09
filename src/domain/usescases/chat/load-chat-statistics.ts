import { ChatStatistics } from "../../models/chat/chat-message";

export interface LoadChatStatistics {
  load(accountId?: number): Promise<ChatStatistics>;
}
