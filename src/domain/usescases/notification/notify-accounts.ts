import { NotificationType } from "../../models/notification/notification-model";

export interface NotifyAccountsModel {
  recipientIds: number[];
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  data?: Record<string, unknown>;
  dedupeKey?: string;
  // "aggregate": atualiza a não lida com o mesmo dedupeKey em vez de criar outra.
  // "skip": não cria se já existir qualquer notificação com o mesmo dedupeKey.
  dedupe?: "aggregate" | "skip";
  // Título usado quando a notificação agrupa mais de um evento.
  aggregateTitle?: (count: number) => string;
}

export interface NotifyAccounts {
  // Retorna quantos destinatários receberam (ou tiveram atualizada) a notificação.
  notify(model: NotifyAccountsModel): Promise<number>;
}
