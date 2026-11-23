export interface NotifyChatMessageModel {
  messageId: number;
  unitStoreId: number;
  unitStoreName?: string | null;
  senderId: number;
  senderName?: string | null;
  text?: string | null;
  hasImage: boolean;
}

export interface NotifyChatMessage {
  notify(message: NotifyChatMessageModel): Promise<void>;
}
