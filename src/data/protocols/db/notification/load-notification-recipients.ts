import { AccountRole } from "@prisma/client";

export interface NotificationRecipientsFilter {
  roles?: AccountRole[];
  // undefined = qualquer unidade; [] = nenhuma conta.
  unitStoreIds?: number[];
  excludeAccountIds?: number[];
}

export interface LoadNotificationRecipientsRepository {
  // Só contas ativas.
  loadRecipientIds(filter: NotificationRecipientsFilter): Promise<number[]>;
}

export interface LoadNetworkUnitIdsRepository {
  // Todas as unidades da rede (raiz + descendentes) a que a unidade pertence.
  loadNetworkUnitIds(unitStoreId: number): Promise<number[]>;
}

export interface LoadAccountVisibleUnitIdsRepository {
  // null = conta sem unidade vinculada (sem restrição de escopo para admin).
  loadVisibleUnitIds(accountId: number): Promise<number[] | null>;
}
