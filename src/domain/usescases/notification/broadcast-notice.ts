import { AccountRole } from "@prisma/client";

export interface BroadcastNoticeModel {
  senderId: number;
  title: string;
  body: string;
  roles?: AccountRole[];
  unitStoreId?: number;
}

export interface BroadcastNotice {
  broadcast(notice: BroadcastNoticeModel): Promise<number>;
}
