import { ChatStatistics } from "../../../../domain/models/chat/chat-message";

export interface LoadChatStatisticsRepository {
  loadStatistics(unitStoreIds?: number[]): Promise<ChatStatistics>;
}
