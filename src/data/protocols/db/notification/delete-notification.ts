export interface DeleteNotificationRepository {
  delete(recipientId: number, id: number): Promise<boolean>;
}
