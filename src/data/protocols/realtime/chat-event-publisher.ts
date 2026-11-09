import { ChatMessage } from "../../../domain/models/chat/chat-message";

export interface ChatMessageDeletedEvent {
  messageId: number;
}

export interface ChatEventPublisher {
  publishMessage(rootStoreId: number | null, message: ChatMessage): void;
  publishDeleted(rootStoreId: number | null, event: ChatMessageDeletedEvent): void;
}
