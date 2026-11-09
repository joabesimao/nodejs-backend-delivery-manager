export interface DeleteChatMessageRepository {
  deleteById(id: number): Promise<void>;
}
