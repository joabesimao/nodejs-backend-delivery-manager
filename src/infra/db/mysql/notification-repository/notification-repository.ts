import { Notification as PrismaNotification, Prisma, PrismaClient } from "@prisma/client";
import { Notification, NotificationType } from "../../../../domain/models/notification/notification-model";
import {
  LoadNotificationsParams,
  LoadNotificationsResult,
} from "../../../../domain/usescases/notification/load-notifications";
import { AddNotificationData, AddNotificationRepository } from "../../../../data/protocols/db/notification/add-notification";
import { FindNotificationByDedupeKeyRepository } from "../../../../data/protocols/db/notification/find-notification-by-dedupe-key";
import {
  UpdateNotificationContentData,
  UpdateNotificationContentRepository,
} from "../../../../data/protocols/db/notification/update-notification-content";
import { LoadNotificationsRepository } from "../../../../data/protocols/db/notification/load-notifications";
import { CountUnreadNotificationsRepository } from "../../../../data/protocols/db/notification/count-unread-notifications";
import {
  MarkAllNotificationsReadRepository,
  MarkNotificationReadRepository,
} from "../../../../data/protocols/db/notification/mark-notification-read";
import { DeleteNotificationRepository } from "../../../../data/protocols/db/notification/delete-notification";
import {
  LoadAccountVisibleUnitIdsRepository,
  LoadNetworkUnitIdsRepository,
  LoadNotificationRecipientsRepository,
  NotificationRecipientsFilter,
} from "../../../../data/protocols/db/notification/load-notification-recipients";
import { getAccountScope, listDescendantUnitIds, resolveRootStoreId } from "../../../../main/realtime/store-scope";

const toNotification = ({ deletedAt, ...row }: PrismaNotification): Notification => ({
  ...row,
  data: (row.data as Record<string, unknown> | null) ?? null,
});

const toJson = (data?: Record<string, unknown>): Prisma.InputJsonValue | undefined =>
  data as Prisma.InputJsonValue | undefined;

export class NotificationMysqlRepository
  implements
    AddNotificationRepository,
    FindNotificationByDedupeKeyRepository,
    UpdateNotificationContentRepository,
    LoadNotificationsRepository,
    CountUnreadNotificationsRepository,
    MarkNotificationReadRepository,
    MarkAllNotificationsReadRepository,
    DeleteNotificationRepository,
    LoadNotificationRecipientsRepository,
    LoadNetworkUnitIdsRepository,
    LoadAccountVisibleUnitIdsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(data: AddNotificationData): Promise<Notification> {
    const row = await this.prisma.notification.create({
      data: {
        recipientId: data.recipientId,
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link,
        data: toJson(data.data),
        dedupeKey: data.dedupeKey,
      },
    });
    return toNotification(row);
  }

  async findByDedupeKey(
    recipientId: number,
    dedupeKey: string,
    options?: { unreadOnly?: boolean; includeDeleted?: boolean }
  ): Promise<Notification | null> {
    const row = await this.prisma.notification.findFirst({
      where: {
        recipientId,
        dedupeKey,
        ...(options?.unreadOnly && { readAt: null }),
        ...(!options?.includeDeleted && { deletedAt: null }),
      },
      orderBy: { id: "desc" },
    });
    return row ? toNotification(row) : null;
  }

  async updateContent(id: number, data: UpdateNotificationContentData): Promise<Notification> {
    const row = await this.prisma.notification.update({
      where: { id },
      data: { title: data.title, body: data.body, data: toJson(data.data) },
    });
    return toNotification(row);
  }

  async load(params: LoadNotificationsParams): Promise<LoadNotificationsResult> {
    // Busca um a mais para saber se há próxima página.
    const rows = await this.prisma.notification.findMany({
      where: {
        recipientId: params.recipientId,
        deletedAt: null,
        ...(params.unreadOnly && { readAt: null }),
      },
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: params.limit + 1,
      ...(params.cursor && { cursor: { id: params.cursor }, skip: 1 }),
    });
    const hasMore = rows.length > params.limit;
    const items = rows.slice(0, params.limit).map(toNotification);
    return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
  }

  async countUnread(recipientId: number): Promise<number> {
    return await this.prisma.notification.count({ where: { recipientId, readAt: null, deletedAt: null } });
  }

  async markRead(recipientId: number, id: number): Promise<Notification | null> {
    const existing = await this.prisma.notification.findFirst({ where: { id, recipientId, deletedAt: null } });
    if (!existing) {
      return null;
    }
    if (existing.readAt) {
      return toNotification(existing);
    }
    const row = await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return toNotification(row);
  }

  async markAllRead(recipientId: number, type?: NotificationType): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { recipientId, readAt: null, deletedAt: null, ...(type && { type }) },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  async delete(recipientId: number, id: number): Promise<boolean> {
    // Lógica: o dedupe "skip" precisa enxergar avisos que o usuário já dispensou.
    const result = await this.prisma.notification.updateMany({
      where: { id, recipientId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return result.count > 0;
  }

  async loadRecipientIds(filter: NotificationRecipientsFilter): Promise<number[]> {
    if (filter.unitStoreIds && filter.unitStoreIds.length === 0) {
      return [];
    }
    const accounts = await this.prisma.account.findMany({
      where: {
        active: true,
        ...(filter.roles && { role: { in: filter.roles } }),
        ...(filter.unitStoreIds && { unitStoreId: { in: filter.unitStoreIds } }),
        ...(filter.excludeAccountIds?.length && { id: { notIn: filter.excludeAccountIds } }),
      },
      select: { id: true },
    });
    return accounts.map((account) => account.id);
  }

  async loadNetworkUnitIds(unitStoreId: number): Promise<number[]> {
    const rootStoreId = await resolveRootStoreId(this.prisma, unitStoreId);
    return await listDescendantUnitIds(this.prisma, rootStoreId);
  }

  async loadVisibleUnitIds(accountId: number): Promise<number[] | null> {
    const scope = await getAccountScope(this.prisma, accountId);
    if (!scope) {
      return [];
    }
    if (!scope.unitStoreId) {
      return scope.role === "principal" ? null : [];
    }
    return scope.visibleUnitIds;
  }
}
