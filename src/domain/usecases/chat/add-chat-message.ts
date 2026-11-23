import { ChatMessage } from "../../models/chat/chat-message";

export interface AddChatMessageModel {
  accountId: number;
  unitStoreId?: number;
  text: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
}

export interface AddChatMessage {
  add(data: AddChatMessageModel): Promise<ChatMessage>;
}
