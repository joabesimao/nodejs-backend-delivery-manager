// Protocolo de use case para carregar mensagens de chat

export interface ChatMessage {
  id: number;
  unitStoreId: number;
  senderId: number;
  text: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
  createdAt: Date;
  sender: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "user";
    unitStoreId: number | null;
  };
  unitStore: {
    id: number;
    name: string;
  };
}

export interface LoadChatMessagesUseCaseRequest {
  accountId: number;
  unitStoreIds: number[];
  limit?: number;
  offset?: number;
  specificUnitStoreId?: number;
}

export interface LoadChatMessagesUseCaseResponse {
  messages: ChatMessage[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface LoadChatMessagesUseCase {
  execute(
    request: LoadChatMessagesUseCaseRequest,
  ): Promise<LoadChatMessagesUseCaseResponse>;
}
