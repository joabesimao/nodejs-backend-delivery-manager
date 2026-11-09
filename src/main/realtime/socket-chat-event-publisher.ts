import { ChatMessage } from "../../domain/models/chat/chat-message";
import {
  ChatEventPublisher,
  ChatMessageDeletedEvent,
} from "../../data/protocols/realtime/chat-event-publisher";
import { emitChatRealtime } from "./realtime-state";

export class SocketChatEventPublisher implements ChatEventPublisher {
  publishMessage(rootStoreId: number | null, message: ChatMessage): void {
    emitChatRealtime("chat:message", rootStoreId, message);
  }

  publishDeleted(rootStoreId: number | null, event: ChatMessageDeletedEvent): void {
    emitChatRealtime("chat:message-deleted", rootStoreId, event);
  }
}
