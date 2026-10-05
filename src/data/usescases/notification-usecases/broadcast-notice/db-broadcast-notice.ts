import { BroadcastNotice, BroadcastNoticeModel } from "../../../../domain/usescases/notification/broadcast-notice";
import { NotifyAccounts } from "../../../../domain/usescases/notification/notify-accounts";
import {
  LoadAccountVisibleUnitIdsRepository,
  LoadNotificationRecipientsRepository,
} from "../../../protocols/db/notification/load-notification-recipients";
import { AccessDeniedError } from "../../../../presentation/errors/access-denied-error";

export class DbBroadcastNotice implements BroadcastNotice {
  constructor(
    private readonly loadAccountVisibleUnitIdsRepository: LoadAccountVisibleUnitIdsRepository,
    private readonly loadNotificationRecipientsRepository: LoadNotificationRecipientsRepository,
    private readonly notifyAccounts: NotifyAccounts
  ) {}

  async broadcast(notice: BroadcastNoticeModel): Promise<number> {
    // null = remetente sem unidade, sem restrição de escopo.
    const visibleUnitIds = await this.loadAccountVisibleUnitIdsRepository.loadVisibleUnitIds(notice.senderId);
    let unitStoreIds = visibleUnitIds ?? undefined;
    if (notice.unitStoreId) {
      if (visibleUnitIds && !visibleUnitIds.includes(notice.unitStoreId)) {
        throw new AccessDeniedError();
      }
      unitStoreIds = [notice.unitStoreId];
    }

    const recipientIds = await this.loadNotificationRecipientsRepository.loadRecipientIds({
      roles: notice.roles?.length ? notice.roles : undefined,
      unitStoreIds,
      excludeAccountIds: [notice.senderId],
    });
    if (recipientIds.length === 0) {
      return 0;
    }

    return await this.notifyAccounts.notify({
      recipientIds,
      type: "admin_notice",
      title: notice.title,
      body: notice.body,
      data: { senderId: notice.senderId },
    });
  }
}
