import { Notification } from "../../../../domain/models/notification/notification-model";
import { NotifyAccounts, NotifyAccountsModel } from "../../../../domain/usescases/notification/notify-accounts";
import { AddNotificationRepository } from "../../../protocols/db/notification/add-notification";
import { FindNotificationByDedupeKeyRepository } from "../../../protocols/db/notification/find-notification-by-dedupe-key";
import { UpdateNotificationContentRepository } from "../../../protocols/db/notification/update-notification-content";
import { CountUnreadNotificationsRepository } from "../../../protocols/db/notification/count-unread-notifications";
import { NotificationPublisher } from "../../../protocols/realtime/notification-publisher";
import { KeyedLock } from "../../../helpers/keyed-lock";

// Notificação é efeito colateral: falhas são registradas e nunca propagadas,
// para não derrubar a operação que a disparou.
export class DbNotifyAccounts implements NotifyAccounts {
  constructor(
    private readonly addNotificationRepository: AddNotificationRepository,
    private readonly findNotificationByDedupeKeyRepository: FindNotificationByDedupeKeyRepository,
    private readonly updateNotificationContentRepository: UpdateNotificationContentRepository,
    private readonly countUnreadNotificationsRepository: CountUnreadNotificationsRepository,
    private readonly notificationPublisher: NotificationPublisher,
    // Compartilhada entre instâncias para serializar o dedupe do mesmo destinatário.
    private readonly dedupeLock: KeyedLock = new KeyedLock()
  ) {}

  async notify(model: NotifyAccountsModel): Promise<number> {
    const recipientIds = Array.from(
      new Set(model.recipientIds.filter((id) => Number.isInteger(id) && id > 0))
    );
    let notified = 0;
    for (const recipientId of recipientIds) {
      try {
        const notification = await this.save(recipientId, model);
        if (!notification) {
          continue;
        }
        notified++;
        await this.publish(recipientId, notification);
      } catch (error) {
        console.error("[notification] falha ao notificar", { recipientId, type: model.type, error });
      }
    }
    return notified;
  }

  private async save(recipientId: number, model: NotifyAccountsModel): Promise<Notification | null> {
    const { dedupeKey } = model;
    if (!dedupeKey || !model.dedupe) {
      return await this.create(recipientId, model);
    }
    // Busca + cria/atualiza não é atômico: sem a trava, dois eventos simultâneos duplicariam a notificação.
    return await this.dedupeLock.run(`${recipientId}:${dedupeKey}`, async () =>
      await this.saveDeduped(recipientId, model, dedupeKey)
    );
  }

  private async saveDeduped(
    recipientId: number,
    model: NotifyAccountsModel,
    dedupeKey: string
  ): Promise<Notification | null> {
    const existing = await this.findNotificationByDedupeKeyRepository.findByDedupeKey(recipientId, dedupeKey, {
      unreadOnly: model.dedupe === "aggregate",
      // Aviso excluído pelo usuário também conta: ele já foi dispensado.
      includeDeleted: model.dedupe === "skip",
    });
    if (!existing) {
      return await this.create(recipientId, model);
    }
    if (model.dedupe === "skip") {
      return null;
    }
    const count = Number(existing.data?.count ?? 1) + 1;
    return await this.updateNotificationContentRepository.updateContent(existing.id, {
      title: model.aggregateTitle ? model.aggregateTitle(count) : model.title,
      body: model.body,
      data: { ...model.data, count },
    });
  }

  private async create(recipientId: number, model: NotifyAccountsModel): Promise<Notification> {
    return await this.addNotificationRepository.add({
      recipientId,
      type: model.type,
      title: model.title,
      body: model.body,
      link: model.link,
      data: model.dedupe === "aggregate" ? { ...model.data, count: 1 } : model.data,
      dedupeKey: model.dedupeKey,
    });
  }

  private async publish(recipientId: number, notification: Notification): Promise<void> {
    try {
      const unreadCount = await this.countUnreadNotificationsRepository.countUnread(recipientId);
      this.notificationPublisher.publishNew(recipientId, notification, unreadCount);
    } catch (error) {
      console.error("[notification] falha ao publicar", { recipientId, error });
    }
  }
}
