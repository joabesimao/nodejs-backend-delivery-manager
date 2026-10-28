export interface CountUnreadNotificationsRepository {
  countUnread(recipientId: number): Promise<number>;
}
