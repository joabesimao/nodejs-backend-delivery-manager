import { ChatMessage } from "../../../../domain/models/chat/chat-message";

export interface AddChatMessageRepositoryModel {
  unitStoreId: number;
  senderId: number;
  text: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
}

export interface AddChatMessageRepository {
  add(data: AddChatMessageRepositoryModel): Promise<ChatMessage>;
}
