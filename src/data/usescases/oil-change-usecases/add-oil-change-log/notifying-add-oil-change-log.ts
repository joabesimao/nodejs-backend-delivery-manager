import { AccountRole } from "@prisma/client";
import { ActorContext } from "../../../../domain/models/actor-context";
import { OilChangeLog } from "../../../../domain/models/oil-change/oil-change-log-model";
import { AddOilChangeLog, AddOilChangeLogModel } from "../../../../domain/usescases/oil-change/add-oil-change-log";
import { NotifyAccounts } from "../../../../domain/usescases/notification/notify-accounts";
import { LoadNotificationRecipientsRepository } from "../../../protocols/db/notification/load-notification-recipients";
import { describeVehicle, formatKm } from "../../../helpers/vehicle-label";

export class NotifyingAddOilChangeLog implements AddOilChangeLog {
  constructor(
    private readonly addOilChangeLog: AddOilChangeLog,
    private readonly loadNotificationRecipientsRepository: LoadNotificationRecipientsRepository,
    private readonly notifyAccounts: NotifyAccounts,
    private readonly managerRoles: AccountRole[]
  ) {}

  async add(log: AddOilChangeLogModel, context?: ActorContext): Promise<OilChangeLog> {
    const created = await this.addOilChangeLog.add(log, context);
    try {
      const recipientIds = await this.loadNotificationRecipientsRepository.loadRecipientIds({
        roles: this.managerRoles,
        excludeAccountIds: context?.actorAccountId ? [context.actorAccountId] : [],
      });
      await this.notifyAccounts.notify({
        recipientIds,
        type: "oil_change_created",
        title: "Troca de óleo registrada",
        body: `${describeVehicle(created.vehicle, created.vehicleId)}: troca em ${formatKm(created.km)}. Próxima em ${formatKm(created.nextChangeKm)}.`,
        link: "/cadastros/troca-oleo",
        data: { vehicleId: created.vehicleId, oilChangeLogId: created.id },
      });
    } catch (error) {
      console.error("[notification] falha ao notificar troca de óleo", { oilChangeLogId: created.id, error });
    }
    return created;
  }
}
