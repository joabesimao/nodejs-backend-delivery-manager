import { ChatMessage } from "../../../../domain/models/chat/chat-message";

export interface ChatMessageFilter {
  unitStoreIds?: number[];
  unitStoreId?: number;
  senderId?: number;
  createdFrom?: Date;
  createdTo?: Date;
  withImage?: boolean;
  withText?: boolean;
  searchText?: string;
}

export interface ChatMessagePageQuery {
  limit: number;
  offset: number;
}

export interface LoadChatMessagesRepository {
  loadPage(
    filter: ChatMessageFilter,
    page: ChatMessagePageQuery,
  ): Promise<{ messages: ChatMessage[]; total: number }>;
}

export interface LoadChatMessageByIdRepository {
  loadById(id: number): Promise<ChatMessage | null>;
}

export interface ChatMessageOwnership {
  id: number;
  senderId: number;
  unitStoreId: number;
  imageBase64: string | null;
}

export interface LoadChatMessageOwnershipRepository {
  loadOwnership(id: number): Promise<ChatMessageOwnership | null>;
}

export interface LoadLatestChatMessagesRepository {
  loadLatest(unitStoreIds: number[], limit: number): Promise<ChatMessage[]>;
}
