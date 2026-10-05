export type NotificationType =
  | "chat_message"
  | "oil_change_due"
  | "oil_change_created"
  | "fuel_refill_created"
  | "admin_notice";

export const NOTIFICATION_TYPES: NotificationType[] = [
  "chat_message",
  "oil_change_due",
  "oil_change_created",
  "fuel_refill_created",
  "admin_notice",
];

export interface Notification {
  id: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  data: Record<string, unknown> | null;
  dedupeKey: string | null;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
