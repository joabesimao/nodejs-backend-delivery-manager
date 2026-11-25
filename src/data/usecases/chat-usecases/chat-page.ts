import { ChatMessage, ChatMessagePage } from "../../../domain/models/chat/chat-message";

export const toChatMessagePage = (
  messages: ChatMessage[],
  total: number,
  limit: number,
  offset: number,
): ChatMessagePage => ({
  messages: messages.reverse(),
  pagination: {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  },
});
