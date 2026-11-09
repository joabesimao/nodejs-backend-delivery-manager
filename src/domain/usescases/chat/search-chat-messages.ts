import { ChatMessagePage } from "../../models/chat/chat-message";

export interface SearchChatMessagesModel {
  accountId?: number;
  searchText?: string;
  unitStoreId?: number;
  senderId?: number;
  limit: number;
  offset: number;
  dateFrom?: Date;
  dateTo?: Date;
  hasImage?: boolean;
  hasText?: boolean;
}

export interface SearchChatMessages {
  search(data: SearchChatMessagesModel): Promise<ChatMessagePage>;
}
