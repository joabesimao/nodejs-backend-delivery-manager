export interface CountUnreadNotifications {
  countUnread(recipientId: number): Promise<number>;
}
