import { ChatMessage, ChatStatistics } from "../domain/models/chat/chat-message";
import { AccountScope } from "../domain/models/store/account-scope";

export const makeFakeScope = (overrides: Partial<AccountScope> = {}): AccountScope => ({
  accountId: 1,
  role: "principal",
  unitStoreId: 10,
  rootStoreId: 10,
  visibleUnitIds: [10, 11],
  ...overrides,
});

export const makeFakeChatMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 5,
  unitStoreId: 10,
  senderId: 1,
  text: "any_text",
  imageBase64: null,
  imageMimeType: null,
  createdAt: new Date("2026-11-06T12:00:00.000Z"),
  sender: { id: 1, name: "any_name", email: "any@mail.com", role: "admin", unitStoreId: 10 },
  unitStore: { id: 10, name: "any_store" },
  ...overrides,
});

export const makeFakeChatStatistics = (): ChatStatistics => ({
  totalMessages: 2,
  messagesWithImages: 1,
  messagesWithText: 2,
  messagesToday: 1,
  uniqueSenders: 2,
  activeUnits: 1,
  lastMessage: null,
  messagesByHour: [{ hour: 23, count: 0 }],
});
