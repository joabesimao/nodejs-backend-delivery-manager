export interface DeleteNotification {
  delete(recipientId: number, id: number): Promise<boolean>;
}
