import { AccountRole } from "../account/account-role";

export interface ChatMessageSender {
  id: number;
  name: string;
  email: string;
  role: AccountRole;
  unitStoreId: number | null;
}

export interface ChatMessageUnitStore {
  id: number;
  name: string;
}

export interface ChatMessage {
  id: number;
  unitStoreId: number;
  senderId: number;
  text: string | null;
  imageBase64: string | null;
  imageMimeType: string | null;
  createdAt: Date;
  sender: ChatMessageSender;
  unitStore: ChatMessageUnitStore;
}

export interface ChatMessagePage {
  messages: ChatMessage[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ChatStatistics {
  totalMessages: number;
  messagesWithImages: number;
  messagesWithText: number;
  messagesToday: number;
  uniqueSenders: number;
  activeUnits: number;
  lastMessage: {
    id: number;
    text: string | null;
    sender: string;
    unit: string;
    createdAt: Date;
  } | null;
  messagesByHour: Array<{ hour: number; count: number }>;
}
