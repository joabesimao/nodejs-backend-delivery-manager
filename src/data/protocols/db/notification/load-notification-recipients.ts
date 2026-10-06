import { AccountRole } from "@prisma/client";

export interface NotificationRecipientsFilter {
  roles?: AccountRole[];
  unitStoreIds?: number[];
  excludeAccountIds?: number[];
}

export interface LoadNotificationRecipientsRepository {
  loadRecipientIds(filter: NotificationRecipientsFilter): Promise<number[]>;
}

export interface LoadNetworkUnitIdsRepository {
  loadNetworkUnitIds(unitStoreId: number): Promise<number[]>;
}

export interface LoadAccountVisibleUnitIdsRepository {
  loadVisibleUnitIds(accountId: number): Promise<number[] | null>;
}
