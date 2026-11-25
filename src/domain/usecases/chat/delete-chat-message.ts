export interface DeleteChatMessage {
  delete(messageId: number, accountId: number): Promise<void>;
}
