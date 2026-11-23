import { NotificationType } from "../../models/notification/notification-model";

export interface NotifyAccountsModel {
  recipientIds: number[];
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  data?: Record<string, unknown>;
  dedupeKey?: string;
  dedupe?: "aggregate" | "skip";
  aggregateTitle?: (count: number) => string;
}

export interface NotifyAccounts {
  notify(model: NotifyAccountsModel): Promise<number>;
}
